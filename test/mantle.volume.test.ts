import { describe, it, before } from "mocha";
import { expect } from "chai";
import { network } from "hardhat";
import {
  type Address,
  type WalletClient,
  type PublicClient,
  formatUnits,
  getAddress,
  parseAbi,
} from "viem";

/**
 * USDC ↔ USDT volume-pumping simulation on a Mantle mainnet fork.
 *
 * Demonstrates how a single actor could repeatedly round-trip the same
 * principal through Merchant Moe (Joe LB v2.2) USDC/USDT pair to inflate
 * reported swap volume. NO real broadcast — fork only.
 *
 * Real router (verified via tx 0xba85236d...4b5d):
 *   0x013e138EF6008ae5FDFDE29700e3f2Bc61d21E3a
 */

const USDC: Address = "0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9";
const USDT: Address = "0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE";
const ROUTER: Address = "0x013e138EF6008ae5FDFDE29700e3f2Bc61d21E3a";
const USDC_WHALE: Address = "0xC868D0EA71243F1580f934CdC59620603Bf9f1f1"; // ~8M USDC on mainnet
const BIN_STEP = 1n; // verified via pair.getBinStep() on mainnet
const VERSION_V2_2 = 3; // 0=V1, 1=V2, 2=V2_1, 3=V2_2 — real USDC/USDT pair uses V2_2
const ITERATIONS = 5;
const PRINCIPAL_USDC = 50_000_000n; // 50 USDC (6 decimals)

const erc20Abi = parseAbi([
  "function balanceOf(address) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
]);

const routerAbi = parseAbi([
  "function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, (uint256[] pairBinSteps, uint8[] versions, address[] tokenPath) path, address to, uint256 deadline) returns (uint256 amountOut)",
]);

describe("Mantle USDC↔USDT volume pump (Merchant Moe LB v2.2 fork sim)", function () {
  this.timeout(120_000);

  let publicClient: PublicClient;
  let walletClient: WalletClient;
  let actor: Address;

  before(async () => {
    const conn = await network.create({ network: "mantleFork" });
    publicClient = (await conn.viem.getPublicClient()) as PublicClient;
    const [wallet] = await conn.viem.getWalletClients();
    walletClient = wallet as WalletClient;
    actor = getAddress(walletClient.account!.address);

    // Seed actor with USDC by impersonating a known whale (NOT the LB pair —
    // pulling from the pair distorts its reserves and causes swap reverts).
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
  });

  it(`round-trips ${formatUnits(PRINCIPAL_USDC, 6)} USDC ${ITERATIONS}x and reports inflated volume`, async () => {
    const startUsdc = await publicClient.readContract({
      address: USDC,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [actor],
    });
    expect(startUsdc).to.equal(PRINCIPAL_USDC);

    const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);
    let cumulativeUsdcVolume = 0n;
    let cumulativeUsdtVolume = 0n;

    console.log(`\n  Actor: ${actor}`);
    console.log(`  Principal: ${formatUnits(PRINCIPAL_USDC, 6)} USDC`);
    console.log(`  Iterations: ${ITERATIONS} round-trips (USDC→USDT→USDC)\n`);
    console.log(
      `  ${"#".padStart(3)}  ${"USDC→USDT".padEnd(18)}  ${"USDT→USDC".padEnd(18)}  ${"actor USDC".padEnd(14)}  ${"vol USDC".padEnd(14)}  ${"vol USDT".padEnd(14)}`,
    );
    console.log(`  ${"-".repeat(95)}`);

    for (let i = 1; i <= ITERATIONS; i++) {
      // --- Leg 1: USDC -> USDT ---
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
          (usdcIn * 95n) / 100n, // 5% slippage tolerance
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

      // --- Leg 2: USDT -> USDC ---
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

      cumulativeUsdcVolume += usdcIn;
      cumulativeUsdtVolume += usdtOut;

      console.log(
        `  ${String(i).padStart(3)}  ${formatUnits(usdcIn, 6).padEnd(18)}  ${formatUnits(usdtOut, 6).padEnd(18)}  ${formatUnits(usdcAfter, 6).padEnd(14)}  ${formatUnits(cumulativeUsdcVolume, 6).padEnd(14)}  ${formatUnits(cumulativeUsdtVolume, 6).padEnd(14)}`,
      );
    }

    const endUsdc = await publicClient.readContract({
      address: USDC,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [actor],
    });
    const lostToFees = PRINCIPAL_USDC - endUsdc;

    console.log(`\n  Reported volume across ${ITERATIONS} round-trips:`);
    console.log(`    USDC leg total: ${formatUnits(cumulativeUsdcVolume, 6)} USDC`);
    console.log(`    USDT leg total: ${formatUnits(cumulativeUsdtVolume, 6)} USDT`);
    console.log(`  Actual principal at risk: ${formatUnits(PRINCIPAL_USDC, 6)} USDC`);
    console.log(`  Cost (lost to LP fees + slippage): ${formatUnits(lostToFees, 6)} USDC`);
    console.log(
      `  Volume amplification: ~${Number(cumulativeUsdcVolume) / Number(PRINCIPAL_USDC)}x principal\n`,
    );

    expect(cumulativeUsdcVolume > PRINCIPAL_USDC * BigInt(ITERATIONS - 1)).to.equal(true);
    expect(endUsdc < PRINCIPAL_USDC).to.equal(true);
  });
});
