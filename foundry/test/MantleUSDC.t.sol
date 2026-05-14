// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test, console} from "forge-std/Test.sol";
import {MantleUSDC} from "src/MantleUSDC.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

contract MantleUSDCForkTest is Test {
    address constant MANTLE_USDC = 0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9;

    MantleUSDC reader;

    function setUp() public {
        // Forks the network specified by --fork-url or [rpc_endpoints].mantle.
        // Falls back to the public RPC if no env var is set.
        string memory rpcUrl = vm.envOr("MANTLE_RPC_URL", string("https://rpc.mantle.xyz"));
        vm.createSelectFork(rpcUrl);

        reader = new MantleUSDC(MANTLE_USDC);
    }

    function test_ReadsUSDCMetadataViaReader() public view {
        MantleUSDC.TokenInfo memory info = reader.info();

        console.log("token:       ", info.token);
        console.log("name:        ", info.name);
        console.log("symbol:      ", info.symbol);
        console.log("decimals:    ", info.decimals);
        console.log("totalSupply: ", info.totalSupply);

        assertEq(info.token, MANTLE_USDC, "token address mismatch");
        assertEq(info.symbol, "USDC", "symbol mismatch");
        assertEq(info.decimals, 6, "decimals mismatch");
        assertGt(info.totalSupply, 0, "totalSupply must be > 0");
    }

    function test_ReadsUSDCMetadataDirectly() public view {
        IERC20Metadata token = IERC20Metadata(MANTLE_USDC);

        string memory name = token.name();
        string memory symbol = token.symbol();
        uint8 decimals = token.decimals();
        uint256 totalSupply = token.totalSupply();

        console.log("direct name:        ", name);
        console.log("direct symbol:      ", symbol);
        console.log("direct decimals:    ", decimals);
        console.log("direct totalSupply: ", totalSupply);

        assertEq(symbol, "USDC");
        assertEq(decimals, 6);
        assertGt(totalSupply, 0);
    }
}
