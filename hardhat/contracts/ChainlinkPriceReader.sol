// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {IAggregatorV3} from "./interfaces/IAggregatorV3.sol";

/// @notice Thin on-chain reader for a Chainlink price feed (AggregatorV3).
/// Same pattern as MantleUSDC.sol: wrap an external contract and expose a struct.
contract ChainlinkPriceReader {
    IAggregatorV3 public immutable feed;

    struct PriceInfo {
        address feed;
        string description;
        uint8 decimals;
        int256 answer;
        uint256 updatedAt;
    }

    constructor(address feedAddress) {
        feed = IAggregatorV3(feedAddress);
    }

    function info() external view returns (PriceInfo memory) {
        (, int256 answer,, uint256 updatedAt,) = feed.latestRoundData();
        return PriceInfo({
            feed: address(feed),
            description: feed.description(),
            decimals: feed.decimals(),
            answer: answer,
            updatedAt: updatedAt
        });
    }
}
