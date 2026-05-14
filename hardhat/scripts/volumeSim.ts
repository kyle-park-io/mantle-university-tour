/**
 * Hardhat 미러 of `foundry/script/VolumeSim.s.sol`.
 *
 * USDC ↔ USDT volume-pumping simulation on a Mantle mainnet fork.
 * Same logic as `test/mantle.volume.test.ts` but written as a runnable script
 * (no Mocha wrapper, no assertions) so it can be invoked outside the test runner.
 * Fork-only — NEVER broadcasts.
 *
 * Run:
 *   npx hardhat run scripts/volumeSim.ts --network mantleFork
 */

import { network } from "hardhat";
import {
  type Address,
  formatUnits,
  getAddress,
  parseAbi,
} from "viem";

const USDC: Address = "0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9";
const USDT: Address = "0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE";
const ROUTER: Address = "0x013e138EF6008ae5FDFDE29700e3f2Bc61d21E3a";
const USDC_WHALE: Address = "0xC868D0EA71243F1580f934CdC59620603Bf9f1f1";
const BIN_STEP = 1n;
const VERSION_V2_2 = 3;
const ITERATIONS = 5;
const PRINCIPAL_USDC = 50_000_000n; // 50 USDC (6 decimals)

const erc20Abi = parseAbi([
  "function balanceOf(address) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transfer(address to, uint256 amount) returns (bool)",
]);

const routerAbi = parseAbi([
  "function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, (uint256[] pairBinSteps, uint8[] versions, address[] tokenPath) path, address to, uint256 deadline) returns (uint256 amountOut)",
]);

async function main() {
  const conn = await network.connect();
  const publicClient = await conn.viem.getPublicClient();
  const [walletClient] = await conn.viem.getWalletClients();
  const actor = getAddress(walletClient.account!.address);

  // Seed actor by impersonating a USDC whale on the fork.
  await conn.networkHelpers.impersonateAccount(USDC_WHALE);
  await conn.networkHelpers.setBalance(USDC_WHALE, 10n ** 18n);
  const whaleAsSigner = await conn.viem.getWalletClient(USDC_WHALE);
  const seedHash = await whaleAsSigner.writeContract({
    address: USDC,
    abi: erc20Abi,
    functionName: "transfer",
    args: [actor, PRINCIPAL_USDC],
  });
  await publicClient.waitForTransactionReceipt({ hash: seedHash });
  await conn.networkHelpers.stopImpersonatingAccount(USDC_WHALE);

  console.log("=== Mantle USDC/USDT volume pump (Merchant Moe LB v2.2) ===");
  console.log(`Actor:      ${actor}`);
  console.log(`Principal:  ${formatUnits(PRINCIPAL_USDC, 6)} USDC`);
  console.log(`Iterations: ${ITERATIONS}`);
  console.log("");
  console.log(
    `  ${"#".padStart(3)}  ${"USDC→USDT".padEnd(18)}  ${"USDT→USDC".padEnd(18)}  ${"actor USDC".padEnd(14)}`,
  );
  console.log(`  ${"-".repeat(60)}`);

  const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);
  let cumulativeUsdc = 0n;
  let cumulativeUsdt = 0n;

  for (let i = 1; i <= ITERATIONS; i++) {
    const usdcIn = await publicClient.readContract({
      address: USDC,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [actor],
    });

    await walletClient.writeContract({
      chain: null,
      account: walletClient.account!,
      address: USDC,
      abi: erc20Abi,
      functionName: "approve",
      args: [ROUTER, usdcIn],
    });

    const swap1 = await walletClient.writeContract({
      chain: null,
      account: walletClient.account!,
      address: ROUTER,
      abi: routerAbi,
      functionName: "swapExactTokensForTokens",
      args: [
        usdcIn,
        (usdcIn * 95n) / 100n,
        {
          pairBinSteps: [BIN_STEP],
          versions: [VERSION_V2_2],
          tokenPath: [USDC, USDT],
        },
        actor,
        deadline,
      ],
    });
    await publicClient.waitForTransactionReceipt({ hash: swap1 });

    const usdtOut = await publicClient.readContract({
      address: USDT,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [actor],
    });

    await walletClient.writeContract({
      chain: null,
      account: walletClient.account!,
      address: USDT,
      abi: erc20Abi,
      functionName: "approve",
      args: [ROUTER, usdtOut],
    });

    const swap2 = await walletClient.writeContract({
      chain: null,
      account: walletClient.account!,
      address: ROUTER,
      abi: routerAbi,
      functionName: "swapExactTokensForTokens",
      args: [
        usdtOut,
        (usdtOut * 95n) / 100n,
        {
          pairBinSteps: [BIN_STEP],
          versions: [VERSION_V2_2],
          tokenPath: [USDT, USDC],
        },
        actor,
        deadline,
      ],
    });
    await publicClient.waitForTransactionReceipt({ hash: swap2 });

    const usdcAfter = await publicClient.readContract({
      address: USDC,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [actor],
    });

    cumulativeUsdc += usdcIn;
    cumulativeUsdt += usdtOut;

    console.log(
      `  ${String(i).padStart(3)}  ${formatUnits(usdcIn, 6).padEnd(18)}  ${formatUnits(usdtOut, 6).padEnd(18)}  ${formatUnits(usdcAfter, 6).padEnd(14)}`,
    );
  }

  const endUsdc = await publicClient.readContract({
    address: USDC,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [actor],
  });
  const lostToFees = PRINCIPAL_USDC - endUsdc;

  console.log("");
  console.log("=== Summary ===");
  console.log(`Reported USDC-leg volume: ${formatUnits(cumulativeUsdc, 6)} USDC`);
  console.log(`Reported USDT-leg volume: ${formatUnits(cumulativeUsdt, 6)} USDT`);
  console.log(`Actual principal at risk: ${formatUnits(PRINCIPAL_USDC, 6)} USDC`);
  console.log(`Cost (LP fees + slippage): ${formatUnits(lostToFees, 6)} USDC`);
  console.log(
    `Volume amplification:     ~${(Number(cumulativeUsdc) / Number(PRINCIPAL_USDC)).toFixed(4)}x principal`,
  );

  await conn.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
