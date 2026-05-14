// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/// @notice Triggers solc's "stack too deep" error when compiled with the default code generator.
///
/// The function below keeps more than 16 local variables alive at the same time, exceeding the
/// EVM's 16-slot stack window. With `via_ir = true` (the IR-based pipeline) the compiler is
/// allowed to spill variables to memory, so the same source compiles cleanly.
///
/// Two foundry profiles in `foundry.toml` toggle the behavior:
///   forge build                              # default profile → fails: stack too deep
///   FOUNDRY_PROFILE=via_ir forge build       # via_ir profile  → succeeds
///
/// See https://docs.soliditylang.org/en/latest/ir-breaking-changes.html for context.
contract StackTooDeepDemo {
    /// @dev 17 independent locals that must all be live until the final return.
    function tooManyLocals(uint256 seed) external pure returns (uint256) {
        uint256 a = seed + 1;
        uint256 b = seed + 2;
        uint256 c = seed + 3;
        uint256 d = seed + 4;
        uint256 e = seed + 5;
        uint256 f = seed + 6;
        uint256 g = seed + 7;
        uint256 h = seed + 8;
        uint256 i = seed + 9;
        uint256 j = seed + 10;
        uint256 k = seed + 11;
        uint256 l = seed + 12;
        uint256 m = seed + 13;
        uint256 n = seed + 14;
        uint256 o = seed + 15;
        uint256 p = seed + 16;
        uint256 q = seed + 17;
        return a + b + c + d + e + f + g + h + i + j + k + l + m + n + o + p + q;
    }
}
