// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

/// @notice Thin on-chain reader for an ERC20 (e.g. Mantle mainnet USDC).
contract MantleUSDC {
    IERC20Metadata public immutable token;

    struct TokenInfo {
        address token;
        string name;
        string symbol;
        uint8 decimals;
        uint256 totalSupply;
    }

    constructor(address tokenAddress) {
        token = IERC20Metadata(tokenAddress);
    }

    function info() external view returns (TokenInfo memory) {
        return TokenInfo({
            token: address(token),
            name: token.name(),
            symbol: token.symbol(),
            decimals: token.decimals(),
            totalSupply: token.totalSupply()
        });
    }

    function balanceOf(address account) external view returns (uint256) {
        return IERC20(address(token)).balanceOf(account);
    }
}
