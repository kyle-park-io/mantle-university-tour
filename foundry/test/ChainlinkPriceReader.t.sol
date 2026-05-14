// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test, console} from "forge-std/Test.sol";
import {ChainlinkPriceReader} from "src/ChainlinkPriceReader.sol";

contract ChainlinkPriceReaderForkTest is Test {
    // Chainlink MNT/USD price feed on Mantle mainnet.
    // https://data.chain.link/feeds/mantle/mantle/mnt-usd
    address constant MNT_USD_FEED = 0xD97F20bEbeD74e8144134C4b148fE93417dd0F96;

    ChainlinkPriceReader reader;

    function setUp() public {
        string memory rpcUrl = vm.envOr("MANTLE_RPC_URL", string("https://rpc.mantle.xyz"));
        vm.createSelectFork(rpcUrl);

        reader = new ChainlinkPriceReader(MNT_USD_FEED);
    }

    function test_ReadsMntUsdFeed() public view {
        ChainlinkPriceReader.PriceInfo memory p = reader.info();

        console.log("feed:        ", p.feed);
        console.log("description: ", p.description);
        console.log("decimals:    ", p.decimals);
        console.log("answer:      ", p.answer);
        console.log("updatedAt:   ", p.updatedAt);

        assertEq(p.feed, MNT_USD_FEED);
        assertEq(p.description, "MNT / USD");
        assertEq(p.decimals, 8);
        assertGt(p.answer, 0);
        assertGt(p.updatedAt, 0);
    }
}
