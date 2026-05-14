/**
 * Hardhat 미러 of `foundry/script/Deploy.s.sol`.
 *
 * Deploys MockERC20 (USDC stand-in) + MantleUSDC reader using viem.
 * Same on-chain effect as the Ignition module (`ignition/modules/MantleUSDCDeploy.ts`)
 * but written as a plain script so newcomers can read it imperatively.
 *
 * Run:
 *   npx hardhat run scripts/deploy.ts --network mantleTestnet
 */

import { network } from "hardhat";
import { formatEther } from "viem";

const TOKEN_NAME = "Mock USD Coin";
const TOKEN_SYMBOL = "USDC";
const TOKEN_DECIMALS = 6;
const INITIAL_SUPPLY = 1_000_000n * 10n ** BigInt(TOKEN_DECIMALS);

async function main() {
  const conn = await network.connect();
  const { viem } = conn;

  const publicClient = await viem.getPublicClient();
  const [walletClient] = await viem.getWalletClients();
  const deployer = walletClient.account!.address;

  const chainId = await publicClient.getChainId();
  const balance = await publicClient.getBalance({ address: deployer });

  console.log("Deployer: ", deployer);
  console.log("ChainId:  ", chainId);
  console.log("Balance:  ", `${formatEther(balance)} MNT`);

  const mockUSDC = await viem.deployContract("MockERC20", [
    TOKEN_NAME,
    TOKEN_SYMBOL,
    TOKEN_DECIMALS,
    deployer,
    INITIAL_SUPPLY,
  ]);

  const reader = await viem.deployContract("MantleUSDC", [mockUSDC.address]);

  console.log("");
  console.log("=== Deployment ===");
  console.log("MockERC20 (USDC): ", mockUSDC.address);
  console.log("MantleUSDC reader:", reader.address);

  if (chainId === 5003) {
    console.log("");
    console.log("=== Mantlescan Sepolia ===");
    console.log(`MockERC20:  https://sepolia.mantlescan.xyz/address/${mockUSDC.address}`);
    console.log(`MantleUSDC: https://sepolia.mantlescan.xyz/address/${reader.address}`);
  } else if (chainId === 5000) {
    console.log("");
    console.log("=== Mantlescan ===");
    console.log(`MockERC20:  https://mantlescan.xyz/address/${mockUSDC.address}`);
    console.log(`MantleUSDC: https://mantlescan.xyz/address/${reader.address}`);
  }

  await conn.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
