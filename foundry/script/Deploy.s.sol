// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script, console} from "forge-std/Script.sol";
import {MockERC20} from "src/mocks/MockERC20.sol";
import {MantleUSDC} from "src/MantleUSDC.sol";

/// @notice Deploys MockERC20 (USDC stand-in) and the MantleUSDC reader on Mantle Sepolia.
contract Deploy is Script {
    string constant TOKEN_NAME = "Mock USD Coin";
    string constant TOKEN_SYMBOL = "USDC";
    uint8 constant TOKEN_DECIMALS = 6;
    uint256 constant INITIAL_SUPPLY = 1_000_000 * 10 ** TOKEN_DECIMALS;

    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);

        console.log("Deployer:    ", deployer);
        console.log("ChainId:     ", block.chainid);

        vm.startBroadcast(deployerKey);

        MockERC20 mockUSDC = new MockERC20(
            TOKEN_NAME, TOKEN_SYMBOL, TOKEN_DECIMALS, deployer, INITIAL_SUPPLY
        );

        MantleUSDC reader = new MantleUSDC(address(mockUSDC));

        vm.stopBroadcast();

        console.log("");
        console.log("=== Deployment ===");
        console.log("MockERC20 (USDC): ", address(mockUSDC));
        console.log("MantleUSDC reader:", address(reader));

        if (block.chainid == 5003) {
            console.log("");
            console.log("=== Mantlescan Sepolia ===");
            console.log(string.concat("MockERC20:   https://sepolia.mantlescan.xyz/address/", vm.toString(address(mockUSDC))));
            console.log(string.concat("MantleUSDC:  https://sepolia.mantlescan.xyz/address/", vm.toString(address(reader))));
        } else if (block.chainid == 5000) {
            console.log("");
            console.log("=== Mantlescan ===");
            console.log(string.concat("MockERC20:   https://mantlescan.xyz/address/", vm.toString(address(mockUSDC))));
            console.log(string.concat("MantleUSDC:  https://mantlescan.xyz/address/", vm.toString(address(reader))));
        }
    }
}
