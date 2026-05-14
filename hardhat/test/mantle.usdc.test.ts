import { expect } from "chai";
import { network } from "hardhat";
import { formatUnits, getAddress } from "viem";

// Mantle mainnet USDC (canonical bridged USDC).
const MANTLE_USDC = getAddress("0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9");

// Mirrors src/MantleUSDC.sol's TokenInfo struct.
type TokenInfo = {
  token: `0x${string}`;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
};

describe("MantleUSDC · forked mainnet ERC20 read", function () {
  this.timeout(180_000);

  it("reads USDC metadata via deployed reader contract", async () => {
    const connection = await network.create({ network: "mantleFork" });
    const { viem } = connection;

    const reader = await viem.deployContract("MantleUSDC", [MANTLE_USDC]);
    const info = (await reader.read.info()) as TokenInfo;

    console.log("\nMantle USDC info (via on-chain reader):");
    console.log({
      token: info.token,
      name: info.name,
      symbol: info.symbol,
      decimals: info.decimals,
      totalSupply: `${formatUnits(info.totalSupply, info.decimals)} ${info.symbol}`,
    });

    expect(info.token).to.equal(MANTLE_USDC);
    expect(info.symbol).to.equal("USDC");
    expect(info.decimals).to.equal(6);
    expect(info.totalSupply).to.be.greaterThan(0n);

    await connection.close();
  });

  it("reads USDC metadata directly via viem (no deployment)", async () => {
    const connection = await network.create({ network: "mantleFork" });
    const { viem } = connection;

    const publicClient = await viem.getPublicClient();

    const erc20Abi = [
      { type: "function", name: "name", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
      { type: "function", name: "symbol", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
      { type: "function", name: "decimals", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] },
      { type: "function", name: "totalSupply", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
    ] as const;

    const [name, symbol, decimals, totalSupply] = await Promise.all([
      publicClient.readContract({ address: MANTLE_USDC, abi: erc20Abi, functionName: "name" }),
      publicClient.readContract({ address: MANTLE_USDC, abi: erc20Abi, functionName: "symbol" }),
      publicClient.readContract({ address: MANTLE_USDC, abi: erc20Abi, functionName: "decimals" }),
      publicClient.readContract({ address: MANTLE_USDC, abi: erc20Abi, functionName: "totalSupply" }),
    ]);

    console.log("\nMantle USDC info (direct viem read):");
    console.log({
      name,
      symbol,
      decimals,
      totalSupply: `${formatUnits(totalSupply, decimals)} ${symbol}`,
    });

    expect(symbol).to.equal("USDC");
    expect(decimals).to.equal(6);

    await connection.close();
  });
});
