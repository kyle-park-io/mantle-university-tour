import { expect } from "chai";
import chainlist, { type Chain } from "eth-chainlist";

const { getChainById, getChainByShortName } = chainlist;

const MANTLE_MAINNET_ID = 5000;
const MANTLE_SEPOLIA_ID = 5003;

function mustFind(chain: Chain | undefined, label: string): Chain {
  expect(chain, `${label} not found in eth-chainlist`).to.exist;
  return chain as Chain;
}

describe("eth-chainlist · Mantle lookup", () => {
  it("finds Mantle mainnet by chainId 5000", () => {
    const chain = mustFind(getChainById(MANTLE_MAINNET_ID), "Mantle mainnet");

    console.log("\nMantle Mainnet:");
    console.log(JSON.stringify(chain, null, 2));

    expect(chain.name).to.equal("Mantle");
    expect(chain.chainId).to.equal(MANTLE_MAINNET_ID);
    expect(chain.nativeCurrency.symbol).to.equal("MNT");
    expect(chain.rpc).to.be.an("array").that.is.not.empty;
    expect(chain.explorers).to.be.an("array").that.is.not.empty;
  });

  it("finds Mantle Sepolia testnet by chainId 5003", () => {
    const chain = mustFind(
      getChainById(MANTLE_SEPOLIA_ID),
      "Mantle Sepolia testnet",
    );

    console.log("\nMantle Sepolia Testnet:");
    console.log(JSON.stringify(chain, null, 2));

    expect(chain.name).to.equal("Mantle Sepolia Testnet");
    expect(chain.chainId).to.equal(MANTLE_SEPOLIA_ID);
    expect(chain.nativeCurrency.symbol).to.equal("MNT");
  });

  it("finds Mantle mainnet by shortName 'mantle'", () => {
    const chain = mustFind(
      getChainByShortName("mantle"),
      "Mantle mainnet by shortName",
    );

    expect(chain.chainId).to.equal(MANTLE_MAINNET_ID);
  });
});
