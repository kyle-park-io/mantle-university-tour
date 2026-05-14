// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test, console} from "forge-std/Test.sol";
import {MockERC20} from "src/mocks/MockERC20.sol";
import {MockERC20Solady} from "src/mocks/MockERC20Solady.sol";

/// @notice Side-by-side gas comparison: OpenZeppelin ERC20 vs Solady ERC20.
/// Run `forge test --match-contract Erc20GasCompare --gas-report` to see the breakdown.
contract Erc20GasCompareTest is Test {
    MockERC20 oz;
    MockERC20Solady solady;

    address alice = address(0xA11CE);
    address bob = address(0xB0B);

    uint256 constant INITIAL = 1_000_000e6;
    uint256 constant TRANSFER = 1_000e6;

    function setUp() public {
        oz = new MockERC20("OZ USDC", "USDC", 6, address(this), INITIAL);
        solady = new MockERC20Solady("Solady USDC", "USDC", 6, address(this), INITIAL);

        oz.transfer(alice, INITIAL / 2);
        solady.transfer(alice, INITIAL / 2);
    }

    function test_GasTransfer_OZ() public {
        vm.prank(alice);
        oz.transfer(bob, TRANSFER);
    }

    function test_GasTransfer_Solady() public {
        vm.prank(alice);
        solady.transfer(bob, TRANSFER);
    }

    function test_GasApprove_OZ() public {
        vm.prank(alice);
        oz.approve(bob, TRANSFER);
    }

    function test_GasApprove_Solady() public {
        vm.prank(alice);
        solady.approve(bob, TRANSFER);
    }

    function test_PrintGasDelta() public {
        uint256 g0 = gasleft();
        vm.prank(alice);
        oz.transfer(bob, TRANSFER);
        uint256 ozGas = g0 - gasleft();

        g0 = gasleft();
        vm.prank(alice);
        solady.transfer(bob, TRANSFER);
        uint256 soladyGas = g0 - gasleft();

        console.log("OZ ERC20 transfer gas:    ", ozGas);
        console.log("Solady ERC20 transfer gas:", soladyGas);
        if (ozGas > soladyGas) {
            console.log("Solady saves:             ", ozGas - soladyGas);
        }
    }
}
