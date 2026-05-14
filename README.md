# mantle-university-tour

Mantle 체인 위에서 컨트랙트 / 포크 시뮬레이션 / 배포를 다루는 워크스페이스입니다. **Hardhat 3** 과 **Foundry** 를 같은 컨트랙트에 대해 각각 보여드리기 위해, 두 스택을 별도 폴더로 분리해 두었습니다.

## 폴더 구조

```
mantle-university-tour/
├── hardhat/   ← Hardhat 3 + viem + Ignition
└── foundry/   ← Foundry (forge / forge script)
```

두 폴더는 서로 독립적입니다. 원하는 스택의 폴더로 이동해서 작업하시면 됩니다.

- **Hardhat 으로 작업하기** → [`hardhat/README.md`](./hardhat/README.md)
- **Foundry 로 작업하기** → [`foundry/README.md`](./foundry/README.md)

## 빠른 시작

```bash
# 처음 받았다면 서브모듈 (forge-std, openzeppelin-contracts) 받기
git submodule update --init --recursive

# Hardhat
cd hardhat
yarn install
yarn test

# Foundry
cd foundry
forge build
forge test
```

## 무엇을 보여드리나요

같은 컨트랙트(`MantleUSDC.sol`)에 대해 다음 작업들을 두 스택에서 각각 보실 수 있습니다.

| 보고 싶으신 것                 | Hardhat                                        | Foundry                          |
| ------------------------------ | ---------------------------------------------- | -------------------------------- |
| 메인넷 USDC 포크 읽기          | `hardhat/test/mantle.usdc.test.ts`             | `foundry/test/MantleUSDC.t.sol`  |
| 체인 정보 조회 (eth-chainlist) | `hardhat/test/mantle.chain.test.ts`            | —                                |
| USDC↔USDT 볼륨 펌프 시뮬       | `hardhat/test/mantle.volume.test.ts`           | `foundry/script/VolumeSim.s.sol` |
| Sepolia 배포                   | `hardhat/ignition/modules/MantleUSDCDeploy.ts` | `foundry/script/Deploy.s.sol`    |

## 볼륨 펌프 시뮬 결과 요약

원금 50 USDC로 5회 라운드트립을 돌리면, 보고되는 거래량은 약 **250 USDC (≈5배 증폭)**까지 부풀려지지만 실제로 발생하는 손실은 약 **0.05 USDC**에 불과합니다.

### 실제 프로덕션에서 왜 발생하나요 (참고)

볼륨 펌프 / wash trading이 메인넷에서 관찰되는 동기는 대략 다음과 같습니다.

- **거래량 = 유동성·인지도 신호**. 데이터 어그리게이터(DefiLlama, CoinGecko 등) 순위·차트에 노출되어 신규 유저와 TVL을 끌어옵니다.
- **CEX 상장 트랙**. 토큰 발행자가 중앙화 거래소 상장을 노릴 때, 사전에 DEX 거래량을 만들어 "수요가 있다"는 인상을 형성합니다.
- **에어드롭 / 포인트 파밍**. 거래량·횟수 기반 보상을 주는 프로토콜에서 자기 자신과 거래해 점수를 누적시킵니다.
- **LP 인센티브 / 리워드 채굴**. 거래량에 비례해 분배되는 토큰 리워드를 받기 위해 의도적으로 페어를 왕복시킵니다.
- **가격 차트 형성**. 신규 페어에서 라인 차트를 만들어 "활성 시장"처럼 보이게 합니다.

> ⚠️ **법적 위치 (요약)**: 볼륨 펌프 / wash trading은 행위 자체가 자동으로 불법인 것은 아니지만, **맥락에 따라 위법이 될 수 있습니다**.
>
> - **합법에 가까운 영역**: 본인 지갑 간 자산 이동, 테스트 트랜잭션, 자기 책임하의 포인트·에어드롭 파밍(프로토콜 약관 위반 가능성은 별개) 등.
> - **회색지대 / 약관 위반**: 거래소·프로토콜의 anti-Sybil 정책·이용약관에 반하는 거래량 부풀리기. 형사 위법은 아니어도 계정 차단·리워드 몰수 사유가 됩니다.
> - **명백한 위법 가능성**: 제3자 투자자가 참여하는 공개 시장에서 가격·거래량을 인위적으로 형성해 매매를 유인하는 경우. 미국에서는 CFTC(상품)·SEC(증권) 관할로 시장조작·wash trading으로 기소된 사례가 있고(예: Coinbase 6.5M USD 합의), 한국에서는 2024년 7월 시행된 「가상자산이용자보호법」 및 자본시장법상 시세조종·부정거래행위로 규제됩니다.
>
> 메인넷에서 wash trading이 광범위하게 관찰되는 것은 사실이지만, 이는 **탐지·관할권·고의 입증의 어려움 때문에 단속이 어렵다**는 뜻이지 합법이라는 뜻이 아닙니다. 실제로 미국 DOJ "Operation Token Mirrors"(2024) 사건에서 마켓메이커들이 DEX wash trading으로 형사 기소·유죄판결을 받았고, CFTC는 Coinbase에 6.5M USD 합의금을 부과한 바 있습니다.
>
> 본 저장소의 코드는 메인넷 fork 위에서 라우터 호출 흐름을 보여주는 **교육·연구용 데모**이며, 실제로 브로드캐스트하지 않습니다. 메인넷에 적용하려는 경우 관할 법령·해당 프로토콜 약관을 반드시 확인하시기 바랍니다.

참고: [Chainalysis — Crypto Market Manipulation 2025](https://www.chainalysis.com/blog/crypto-market-manipulation-wash-trading-pump-and-dump-2025/), [Wash Trading on DEXes (Medium)](https://medium.com/@alexanderzaidelson/wash-trading-and-mirrorwash-trading-on-dexes-1f15a1f4587b), [Berkeley DeFi — Detecting and Quantifying Wash Trading on DEXes (PDF)](https://berkeley-defi.github.io/assets/material/Detecting%20and%20Quantifying%20Wash%20Trading.pdf), [CoinDesk — DOJ sting on crypto wash trading (2026)](https://www.coindesk.com/business/2026/04/02/doj-sting-exposes-crypto-wash-trading-continues-to-be-far-more-common-than-expected).

사용된 컨트랙트는 다음과 같습니다.

- USDC: [`0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9`](https://mantlescan.xyz/token/0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9)
- USDT: [`0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE`](https://mantlescan.xyz/token/0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE)
- Merchant Moe LB Router: [`0x013e138EF6008ae5FDFDE29700e3f2Bc61d21E3a`](https://mantlescan.xyz/address/0x013e138EF6008ae5FDFDE29700e3f2Bc61d21E3a)
- USDC/USDT LB Pair (binStep=1, V2_2): [`0x48C1A89af1102Cad358549e9Bb16aE5f96CddFEc`](https://mantlescan.xyz/address/0x48C1A89af1102Cad358549e9Bb16aE5f96CddFEc)
- Chainlink MNT/USD Feed: [`0xD97F20bEbeD74e8144134C4b148fE93417dd0F96`](https://data.chain.link/feeds/mantle/mantle/mnt-usd)
