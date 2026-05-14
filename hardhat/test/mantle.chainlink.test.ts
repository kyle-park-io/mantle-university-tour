import { expect } from "chai";
import { network } from "hardhat";
import { getAddress } from "viem";

// Chainlink MNT/USD price feed on Mantle mainnet.
// https://data.chain.link/feeds/mantle/mantle/mnt-usd
const MNT_USD_FEED = getAddress("0xD97F20bEbeD74e8144134C4b148fE93417dd0F96");

type PriceInfo = {
  feed: `0x${string}`;
  description: string;
  decimals: number;
  answer: bigint;
  updatedAt: bigint;
};

describe("ChainlinkPriceReader · forked Mantle mainnet", function () {
  this.timeout(180_000);

  it("reads MNT/USD price feed via deployed reader contract", async () => {
    const connection = await network.create({ network: "mantleFork" });
    const { viem } = connection;

    const reader = await viem.deployContract("ChainlinkPriceReader", [MNT_USD_FEED]);
    const info = (await reader.read.info()) as PriceInfo;

    console.log("\nMantle MNT/USD price (via on-chain reader):");
    console.log({
      feed: info.feed,
      description: info.description,
      decimals: info.decimals,
      answer: info.answer.toString(),
      price: `${Number(info.answer) / 10 ** info.decimals} USD`,
      updatedAt: new Date(Number(info.updatedAt) * 1000).toISOString(),
    });

    expect(info.feed).to.equal(MNT_USD_FEED);
    expect(info.description).to.equal("MNT / USD");
    expect(info.decimals).to.equal(8);
    expect(info.answer).to.be.greaterThan(0n);
    expect(info.updatedAt).to.be.greaterThan(0n);

    await connection.close();
  });
});
