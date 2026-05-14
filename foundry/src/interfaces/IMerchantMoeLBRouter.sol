// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/// @notice Minimal subset of Merchant Moe (Joe Liquidity Book v2.2) LBRouter on Mantle.
/// Real router: 0x013e138EF6008ae5FDFDE29700e3f2Bc61d21E3a
interface IMerchantMoeLBRouter {
    enum Version {
        V1,
        V2,
        V2_1,
        V2_2
    }

    struct Path {
        uint256[] pairBinSteps;
        Version[] versions;
        address[] tokenPath;
    }

    function getFactory() external view returns (address);

    function getWNATIVE() external view returns (address);

    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        Path calldata path,
        address to,
        uint256 deadline
    )
        external
        returns (uint256 amountOut);
}
