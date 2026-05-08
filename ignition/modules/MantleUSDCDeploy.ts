import { buildModule } from "@nomicfoundation/ignition-core";

const TOKEN_NAME = "Mock USD Coin";
const TOKEN_SYMBOL = "USDC";
const TOKEN_DECIMALS = 6;
// 1,000,000 USDC (6 decimals) → 1_000_000 * 10^6
const INITIAL_SUPPLY = 1_000_000n * 10n ** BigInt(TOKEN_DECIMALS);

export default buildModule("MantleUSDCDeploy", (m) => {
  const initialReceiver = m.getAccount(0);

  const mockUSDC = m.contract("MockERC20", [
    TOKEN_NAME,
    TOKEN_SYMBOL,
    TOKEN_DECIMALS,
    initialReceiver,
    INITIAL_SUPPLY,
  ]);

  const reader = m.contract("MantleUSDC", [mockUSDC]);

  return { mockUSDC, reader };
});
