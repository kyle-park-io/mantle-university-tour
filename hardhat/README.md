# mantle-university-tour · Hardhat

Mantle 컨트랙트 작업을 **Hardhat 3 + viem** 으로 다루는 워크스페이스입니다. Foundry 쪽은 `../foundry`에 별도로 분리되어 있습니다.

## 폴더 구조

| 파일 / 폴더                                     | 설명                                          | 참고 링크                                                                                                                                             |
| ----------------------------------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hardhat.config.ts`                             | Hardhat 3 설정 (네트워크, solidity)           | [Hardhat 3 docs](https://hardhat.org)                                                                                                                 |
| `contracts/MantleUSDC.sol`                      | ERC20 메타데이터 리더                         | [Mantle USDC on Mantlescan](https://mantlescan.xyz/token/0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9)                                                  |
| `contracts/ChainlinkPriceReader.sol`            | Chainlink price feed 리더                     | [MNT/USD feed](https://data.chain.link/feeds/mantle/mantle/mnt-usd) · [AggregatorV3Interface](https://docs.chain.link/data-feeds/api-reference)       |
| `contracts/interfaces/IMerchantMoeLBRouter.sol` | Merchant Moe LB v2.2 라우터 인터페이스        | [Merchant Moe docs](https://merchantmoe.com/) · [라우터 컨트랙트](https://mantlescan.xyz/address/0x013e138EF6008ae5FDFDE29700e3f2Bc61d21E3a)          |
| `contracts/interfaces/IAggregatorV3.sol`        | Chainlink AggregatorV3 최소 인터페이스        | [Chainlink contracts repo](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol) |
| `contracts/mocks/MockERC20.sol`                 | OpenZeppelin 기반 USDC 스탠드인               | [OpenZeppelin ERC20 docs](https://docs.openzeppelin.com/contracts/5.x/erc20) · [GitHub](https://github.com/OpenZeppelin/openzeppelin-contracts)       |
| `contracts/mocks/MockERC20Solady.sol`           | Solady 기반 USDC 스탠드인                     | [Solady ERC20 source](https://github.com/Vectorized/solady/blob/main/src/tokens/ERC20.sol)                                                            |
| `test/mantle.chain.test.ts`                     | eth-chainlist로 체인 정보 조회                | [eth-chainlist npm](https://www.npmjs.com/package/eth-chainlist) · [ChainList](https://chainlist.org/chain/5000)                                      |
| `test/mantle.usdc.test.ts`                      | 메인넷 USDC 포크 읽기 (viem)                  | [viem docs](https://viem.sh/docs/introduction)                                                                                                        |
| `test/mantle.chainlink.test.ts`                 | 메인넷 MNT/USD 피드 포크 읽기                 | [Chainlink data feeds](https://docs.chain.link/data-feeds)                                                                                            |
| `test/mantle.volume.test.ts`                    | USDC↔USDT 볼륨 펌프 시뮬 (fork)               | [LB v2.2 (Joe) docs](https://docs.lfj.gg/V2.2)                                                                                                        |
| `ignition/modules/MantleUSDCDeploy.ts`          | Mantle Sepolia 배포 모듈 (선언적)             | [Hardhat Ignition docs](https://hardhat.org/ignition/docs/getting-started)                                                                            |
| `scripts/deploy.ts`                             | Mantle Sepolia 배포 스크립트 (명령형/viem)    | [`hardhat run` 가이드](https://hardhat.org/hardhat-runner/docs/guides/scripts)                                                                        |
| `scripts/volumeSim.ts`                          | 볼륨 펌프 시뮬 스크립트 버전 (broadcast 없음) | [Mantle 메인넷 RPC](https://docs.mantle.xyz/network/system-information/network-details)                                                               |

## 자주 쓰이는 명령어

```bash
# 의존성 설치
yarn install

# 테스트
yarn test

# 볼륨 펌프 시뮬 (메인넷 fork, broadcast 없음)
yarn volume:sim              # mocha 테스트 형태
yarn volume:sim:script       # hardhat run 스크립트 형태 (foundry script와 동일한 흐름)

# Mantle Sepolia 배포 — 두 가지 방식
yarn deploy:ignition:testnet # Ignition 모듈 (선언적, 상태 추적)
yarn deploy:script:testnet   # hardhat run 스크립트 (명령형, viem 직접 호출)
```

## Mantlescan 컨트랙트 검증

Hardhat 3에는 `hardhat-verify` 가 빌트인되어 있어 `hardhat.config.ts` 의 `verify.etherscan` 설정과 `chainDescriptors` 만 있으면 다음 명령으로 verify 됩니다.

```bash
# Mantle Sepolia 에 배포한 컨트랙트 verify
npx hardhat verify --network mantleTestnet <address> [constructor args...]

# Mantle Mainnet
npx hardhat verify --network mantle <address> [constructor args...]
```

`MANTLESCAN_API_KEY` 가 `.env` 에 설정되어 있어야 합니다.

## .env 설정

`.env.example`을 `.env`로 복사한 뒤 값을 채우시면 됩니다.

## 참고 링크

### 프레임워크 / 도구

- Hardhat 3: <https://hardhat.org> · <https://github.com/NomicFoundation/hardhat>
- Hardhat Ignition: <https://hardhat.org/ignition/docs/getting-started>
- Hardhat Verify: <https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify>
- viem: <https://viem.sh> · <https://github.com/wevm/viem>
- eth-chainlist: <https://www.npmjs.com/package/eth-chainlist>

### 스마트 컨트랙트 라이브러리

- OpenZeppelin Contracts v5: <https://docs.openzeppelin.com/contracts/5.x> · <https://github.com/OpenZeppelin/openzeppelin-contracts>
- Solady: <https://github.com/Vectorized/solady>

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
