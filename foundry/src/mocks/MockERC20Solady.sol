// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {ERC20} from "solady/tokens/ERC20.sol";

/// @notice Same shape as MockERC20.sol but built on Solady's gas-optimized ERC20.
/// Used to demonstrate the gas delta vs the OpenZeppelin implementation.
contract MockERC20Solady is ERC20 {
    string private _name;
    string private _symbol;
    uint8 private immutable _decimals;

    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        address initialReceiver,
        uint256 initialSupply
    ) {
        _name = name_;
        _symbol = symbol_;
        _decimals = decimals_;
        if (initialSupply > 0) {
            _mint(initialReceiver, initialSupply);
        }
    }

    function name() public view override returns (string memory) {
        return _name;
    }

    function symbol() public view override returns (string memory) {
        return _symbol;
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
