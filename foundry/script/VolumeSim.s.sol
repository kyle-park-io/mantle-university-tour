// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script, console} from "forge-std/Script.sol";
import {StdCheats} from "forge-std/StdCheats.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IMerchantMoeLBRouter} from "src/interfaces/IMerchantMoeLBRouter.sol";

/// @notice USDC <-> USDT volume-pumping simulation on a Mantle mainnet fork.
///         No vm.broadcast — purely a fork-only demonstration of how the same
///         principal can be round-tripped to inflate reported swap volume.
///
///         Run: forge script scripts/forge/VolumeSim.s.sol:VolumeSim \
///                  --fork-url $MANTLE_RPC_URL -vvv
contract VolumeSim is Script, StdCheats {
    address constant USDC = 0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9;
    address constant USDT = 0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE;
    address constant ROUTER = 0x013e138EF6008ae5FDFDE29700e3f2Bc61d21E3a;
    address constant USDC_USDT_PAIR = 0x48C1A89af1102Cad358549e9Bb16aE5f96CddFEc;

    uint256 constant BIN_STEP = 1;
    uint256 constant ITERATIONS = 5;
    uint256 constant PRINCIPAL_USDC = 50_000_000; // 50 USDC (6 decimals)

    address constant ACTOR = address(0xA11CE);

    function run() external {
        console.log("=== Mantle USDC/USDT volume pump (Merchant Moe LB v2.2) ===");
        console.log("Fork chainId:", block.chainid);
        console.log("Actor:        ", ACTOR);
        console.log("Principal:    50 USDC");
        console.log("Iterations:   ", ITERATIONS);
        console.log("");

        // Seed actor with USDC via forge cheatcode (no real funds, no broadcast).
        deal(USDC, ACTOR, PRINCIPAL_USDC);
        require(IERC20(USDC).balanceOf(ACTOR) == PRINCIPAL_USDC, "seed failed");

        uint256 cumulativeUsdc;
        uint256 cumulativeUsdt;
        uint256 deadline = block.timestamp + 3600;

        console.log(" #  USDC->USDT in       USDT->USDC in       actor USDC after");
        console.log("---------------------------------------------------------------");

        for (uint256 i = 1; i <= ITERATIONS; i++) {
            uint256 usdcIn = IERC20(USDC).balanceOf(ACTOR);

            vm.startPrank(ACTOR);

            // --- Leg 1: USDC -> USDT ---
            IERC20(USDC).approve(ROUTER, usdcIn);
            IMerchantMoeLBRouter.Path memory path1 = _path(USDC, USDT);
            IMerchantMoeLBRouter(ROUTER).swapExactTokensForTokens(
                usdcIn, (usdcIn * 95) / 100, path1, ACTOR, deadline
            );

            uint256 usdtOut = IERC20(USDT).balanceOf(ACTOR);

            // --- Leg 2: USDT -> USDC ---
            IERC20(USDT).approve(ROUTER, usdtOut);
            IMerchantMoeLBRouter.Path memory path2 = _path(USDT, USDC);
            IMerchantMoeLBRouter(ROUTER).swapExactTokensForTokens(
                usdtOut, (usdtOut * 95) / 100, path2, ACTOR, deadline
            );

            vm.stopPrank();

            cumulativeUsdc += usdcIn;
            cumulativeUsdt += usdtOut;

            console.log(
                string.concat(
                    " ",
                    vm.toString(i),
                    "  ",
                    _fmt6(usdcIn),
                    "  ",
                    _fmt6(usdtOut),
                    "  ",
                    _fmt6(IERC20(USDC).balanceOf(ACTOR))
                )
            );
        }

        uint256 endUsdc = IERC20(USDC).balanceOf(ACTOR);
        uint256 lost = PRINCIPAL_USDC - endUsdc;

        console.log("");
        console.log("=== Summary ===");
        console.log(string.concat("Reported USDC-leg volume: ", _fmt6(cumulativeUsdc), " USDC"));
        console.log(string.concat("Reported USDT-leg volume: ", _fmt6(cumulativeUsdt), " USDT"));
        console.log(string.concat("Actual principal at risk: ", _fmt6(PRINCIPAL_USDC), " USDC"));
        console.log(string.concat("Cost (LP fees + slippage):", _fmt6(lost), " USDC"));
        console.log(
            string.concat(
                "Volume amplification:    ~", vm.toString(cumulativeUsdc / PRINCIPAL_USDC), "x principal"
            )
        );
    }

    function _path(
        address from,
        address to
    )
        internal
        pure
        returns (IMerchantMoeLBRouter.Path memory p)
    {
        p.pairBinSteps = new uint256[](1);
        p.pairBinSteps[0] = BIN_STEP;
        p.versions = new IMerchantMoeLBRouter.Version[](1);
        p.versions[0] = IMerchantMoeLBRouter.Version.V2_2;
        p.tokenPath = new address[](2);
        p.tokenPath[0] = from;
        p.tokenPath[1] = to;
    }

    /// @dev Format a 6-decimal token amount as "<integer>.<6-digit-fraction>".
    function _fmt6(uint256 amount) internal pure returns (string memory) {
        uint256 whole = amount / 1e6;
        uint256 frac = amount % 1e6;
        bytes memory fracStr = bytes(vm.toString(frac));
        bytes memory padded = new bytes(6);
        uint256 pad = 6 - fracStr.length;
        for (uint256 i = 0; i < pad; i++) {
            padded[i] = "0";
        }
        for (uint256 i = 0; i < fracStr.length; i++) {
            padded[pad + i] = fracStr[i];
        }
        return string.concat(vm.toString(whole), ".", string(padded));
    }
}
