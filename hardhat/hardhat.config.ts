import "dotenv/config";
import { defineConfig } from "hardhat/config";
import HardhatToolboxViem from "@nomicfoundation/hardhat-toolbox-viem";
import HardhatMocha from "@nomicfoundation/hardhat-mocha";

const PRIVATE_KEY = process.env.PRIVATE_KEY ?? "";
const MANTLE_RPC_URL = process.env.MANTLE_RPC_URL ?? "https://rpc.mantle.xyz";
const MANTLE_TESTNET_RPC_URL =
  process.env.MANTLE_TESTNET_RPC_URL ?? "https://rpc.sepolia.mantle.xyz";
const MANTLESCAN_API_KEY = process.env.MANTLESCAN_API_KEY ?? "";

const accounts = PRIVATE_KEY ? [PRIVATE_KEY] : [];

export default defineConfig({
  plugins: [HardhatToolboxViem, HardhatMocha],
  solidity: {
    version: "0.8.26",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: false,
      evmVersion: "cancun",
    },
  },
  paths: {
    sources: "./contracts",
    tests: {
      mocha: "./test",
      nodejs: "./test/node",
    },
    cache: "./cache_hardhat",
    artifacts: "./artifacts",
  },
  networks: {
    hardhat: {
      type: "edr-simulated",
      chainId: 31337,
    },
    mantleFork: {
      type: "edr-simulated",
      chainId: 5000,
      forking: {
        enabled: true,
        url: MANTLE_RPC_URL,
      },
    },
    localhost: {
      type: "http",
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    mantleTestnet: {
      type: "http",
      url: MANTLE_TESTNET_RPC_URL,
      chainId: 5003,
      accounts,
      gasPrice: 1_000_000_000n,
    },
    mantle: {
      type: "http",
      url: MANTLE_RPC_URL,
      chainId: 5000,
      accounts,
      gasPrice: 1_000_000_000n,
    },
  },
  chainDescriptors: {
    5000: {
      name: "Mantle",
      hardforkHistory: {
        cancun: { blockNumber: 0 },
      },
      blockExplorers: {
        etherscan: {
          name: "Mantlescan",
          url: "https://mantlescan.xyz",
          apiUrl: "https://api.mantlescan.xyz/api",
        },
      },
    },
    5003: {
      name: "Mantle Sepolia",
      blockExplorers: {
        etherscan: {
          name: "Mantlescan Sepolia",
          url: "https://sepolia.mantlescan.xyz",
          apiUrl: "https://api-sepolia.mantlescan.xyz/api",
        },
      },
    },
  },
  verify: {
    etherscan: {
      apiKey: MANTLESCAN_API_KEY,
    },
  },
});
