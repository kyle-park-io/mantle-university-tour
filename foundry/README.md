# mantle-university-tour · Foundry

Mantle 컨트랙트 작업을 **Foundry** 로 다루는 워크스페이스입니다. Hardhat 쪽은 `../hardhat`에 별도로 분리되어 있습니다.

## 폴더 구조

| 파일 / 폴더                               | 설명                                    | 참고 링크                                                                                                                                             |
| ----------------------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `foundry.toml`                            | Foundry 설정 (프로파일 포함)            | [Foundry Book — config](https://book.getfoundry.sh/reference/config/overview)                                                                         |
| `remappings.txt`                          | Solidity import 경로 매핑               | [Foundry Book — remappings](https://book.getfoundry.sh/projects/dependencies#remapping-dependencies)                                                  |
| `src/MantleUSDC.sol`                      | ERC20 메타데이터 리더                   | [Mantle USDC on Mantlescan](https://mantlescan.xyz/token/0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9)                                                  |
| `src/ChainlinkPriceReader.sol`            | Chainlink price feed 리더               | [MNT/USD feed](https://data.chain.link/feeds/mantle/mantle/mnt-usd) · [AggregatorV3 API](https://docs.chain.link/data-feeds/api-reference)            |
| `src/interfaces/IMerchantMoeLBRouter.sol` | Merchant Moe LB v2.2 라우터 인터페이스  | [Merchant Moe docs](https://merchantmoe.com/) · [라우터 컨트랙트](https://mantlescan.xyz/address/0x013e138EF6008ae5FDFDE29700e3f2Bc61d21E3a)          |
| `src/interfaces/IAggregatorV3.sol`        | Chainlink AggregatorV3 최소 인터페이스  | [Chainlink contracts repo](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol) |
| `src/mocks/MockERC20.sol`                 | OpenZeppelin 기반 USDC 스탠드인         | [OpenZeppelin ERC20 docs](https://docs.openzeppelin.com/contracts/5.x/erc20) · [GitHub](https://github.com/OpenZeppelin/openzeppelin-contracts)       |
| `src/mocks/MockERC20Solady.sol`           | Solady 기반 USDC 스탠드인 (가스 비교용) | [Solady ERC20 source](https://github.com/Vectorized/solady/blob/main/src/tokens/ERC20.sol)                                                            |
| `test/MantleUSDC.t.sol`                   | 메인넷 USDC 포크 읽기 테스트            | [Foundry forking guide](https://book.getfoundry.sh/forge/fork-testing)                                                                                |
| `test/ChainlinkPriceReader.t.sol`         | 메인넷 MNT/USD 피드 포크 읽기 테스트    | [Chainlink data feeds](https://docs.chain.link/data-feeds)                                                                                            |
| `test/Erc20GasCompare.t.sol`              | OZ vs Solady ERC20 가스 비교            | [`forge test --gas-report`](https://book.getfoundry.sh/forge/gas-reports)                                                                             |
| `demos/stack_too_deep/`                   | `via_ir` 토글 데모 (별도 프로파일)      | [Solidity IR pipeline](https://docs.soliditylang.org/en/latest/ir-breaking-changes.html)                                                              |
| `script/Deploy.s.sol`                     | Mantle Sepolia 배포 스크립트            | [Foundry scripting](https://book.getfoundry.sh/tutorials/solidity-scripting)                                                                          |
| `script/VolumeSim.s.sol`                  | USDC↔USDT 볼륨 펌프 시뮬 (fork)         | [LB v2.2 (Joe) docs](https://docs.lfj.gg/V2.2)                                                                                                        |
| `lib/forge-std`                           | forge-std (서브모듈)                    | <https://github.com/foundry-rs/forge-std>                                                                                                             |
| `lib/openzeppelin-contracts`              | OpenZeppelin v5 (서브모듈)              | <https://github.com/OpenZeppelin/openzeppelin-contracts>                                                                                              |
| `lib/solady`                              | Solady (서브모듈)                       | <https://github.com/Vectorized/solady>                                                                                                                |

## 사전 준비

서브모듈을 처음 받는 경우:

```bash
git submodule update --init --recursive
```

## 자주 쓰이는 명령어

```bash
# 빌드 / 테스트
forge build
forge test
forge test -vvv          # 자세한 로그
forge test --gas-report  # 가스 리포트 (OZ vs Solady 비교 포함)

# 볼륨 펌프 시뮬 (메인넷 fork, broadcast 없음)
set -a && . ./.env && set +a
forge script script/VolumeSim.s.sol:VolumeSim --fork-url "$MANTLE_RPC_URL" -vv

# Mantle Sepolia 배포
forge script script/Deploy.s.sol:Deploy --rpc-url "$MANTLE_TESTNET_RPC_URL" --broadcast --legacy --slow
```

### Stack-too-deep 데모

같은 컨트랙트(`demos/stack_too_deep/StackTooDeepDemo.sol`)를 두 프로파일로 빌드해 차이를 확인합니다.

```bash
FOUNDRY_PROFILE=stack_deep forge build   # ❌ Stack too deep 에러
FOUNDRY_PROFILE=via_ir     forge build   # ✅ 같은 소스, 컴파일 성공
```

> `via_ir = true` 는 컴파일러가 변수를 메모리로 spill 할 수 있게 해주는 IR 기반 파이프라인을 켭니다. 가스 최적화 효과도 일부 있지만, 컴파일 시간이 늘어납니다.

## Mantlescan 컨트랙트 검증

배포한 컨트랙트를 Mantlescan에서 verify 하는 명령어입니다.

```bash
set -a && . ./.env && set +a

# Mantle Mainnet (chain id 5000)
forge verify-contract <address> src/MantleUSDC.sol:MantleUSDC \
  --chain-id 5000 \
  --verifier etherscan \
  --verifier-url https://api.mantlescan.xyz/api \
  --etherscan-api-key "$MANTLESCAN_API_KEY"

# Mantle Sepolia (chain id 5003)
forge verify-contract <address> src/MantleUSDC.sol:MantleUSDC \
  --chain-id 5003 \
  --verifier etherscan \
  --verifier-url https://api-sepolia.mantlescan.xyz/api \
  --etherscan-api-key "$MANTLESCAN_API_KEY"
```

생성자 인자가 있는 컨트랙트는 `--constructor-args $(cast abi-encode "constructor(address)" 0x...)` 를 추가하시면 됩니다.

## .env 설정

`.env.example`을 `.env`로 복사한 뒤 값을 채우시면 됩니다.

## 참고 링크

### 프레임워크 / 도구

- Foundry: <https://getfoundry.sh> · <https://github.com/foundry-rs/foundry>
- Foundry Book: <https://book.getfoundry.sh>
- forge-std: <https://github.com/foundry-rs/forge-std>

### 스마트 컨트랙트 라이브러리

- OpenZeppelin Contracts v5: <https://docs.openzeppelin.com/contracts/5.x> · <https://github.com/OpenZeppelin/openzeppelin-contracts>
- Solady: <https://github.com/Vectorized/solady>

### Solidity / 컴파일러

- IR pipeline (`via_ir`) breaking changes: <https://docs.soliditylang.org/en/latest/ir-breaking-changes.html>

### Mantle

- 공식 문서: <https://docs.mantle.xyz>
- Mantlescan (Mainnet): <https://mantlescan.xyz>
- Mantlescan (Sepolia): <https://sepolia.mantlescan.xyz>
- Bridge: <https://bridge.mantle.xyz>

### 메인넷에서 사용된 컨트랙트

- USDC: [`0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9`](https://mantlescan.xyz/token/0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9)
- USDT: [`0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE`](https://mantlescan.xyz/token/0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE)
- Merchant Moe LB Router: [`0x013e138EF6008ae5FDFDE29700e3f2Bc61d21E3a`](https://mantlescan.xyz/address/0x013e138EF6008ae5FDFDE29700e3f2Bc61d21E3a)
- USDC/USDT LB Pair (binStep=1, V2_2): [`0x48C1A89af1102Cad358549e9Bb16aE5f96CddFEc`](https://mantlescan.xyz/address/0x48C1A89af1102Cad358549e9Bb16aE5f96CddFEc)
- Chainlink MNT/USD Feed: [`0xD97F20bEbeD74e8144134C4b148fE93417dd0F96`](https://data.chain.link/feeds/mantle/mantle/mnt-usd)
