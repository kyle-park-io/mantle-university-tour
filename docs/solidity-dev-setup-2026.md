# 2026년 Solidity 개발 환경 세팅 가이드

> 최신 업데이트: 2026-05-14

---

## 목차

- [2026년 Solidity 개발 환경 세팅 가이드](#2026년-solidity-개발-환경-세팅-가이드)
  - [목차](#목차)
  - [1. 기본 시스템 요구사항](#1-기본-시스템-요구사항)
  - [2. 개발 프레임워크](#2-개발-프레임워크)
    - [2.1 Foundry](#21-foundry)
    - [2.2 Hardhat 3](#22-hardhat-3)
    - [2.3 Remix IDE](#23-remix-ide)
  - [3. 에디터 / IDE 확장](#3-에디터--ide-확장)
  - [4. 스마트 컨트랙트 라이브러리](#4-스마트-컨트랙트-라이브러리)
    - [4.1 OpenZeppelin Contracts](#41-openzeppelin-contracts)
    - [4.2 Solady](#42-solady)
    - [4.3 forge-std](#43-forge-std)
    - [4.4 PRBMath](#44-prbmath)
  - [5. 클라이언트 SDK (JS/TS)](#5-클라이언트-sdk-jsts)
    - [5.1 ethers.js](#51-ethersjs)
    - [5.2 viem](#52-viem)
    - [5.3 wagmi](#53-wagmi)
  - [6. 오라클 / Chainlink](#6-오라클--chainlink)
  - [7. RPC 제공자 / 노드](#7-rpc-제공자--노드)
    - [메이저 상용 제공자](#메이저-상용-제공자)
    - [공개 무료 엔드포인트 (개발/테스트용, 프로덕션 비권장)](#공개-무료-엔드포인트-개발테스트용-프로덕션-비권장)
    - [권장 패턴](#권장-패턴)
  - [8. Mantle (L2)](#8-mantle-l2)
    - [체인 정보](#체인-정보)
    - [공식 링크](#공식-링크)
    - [외부 RPC 제공자](#외부-rpc-제공자)
    - [Foundry로 배포](#foundry로-배포)
    - [Mantlescan 검증 (Hardhat)](#mantlescan-검증-hardhat)
    - [Foundry로 검증](#foundry로-검증)
  - [9. 보안 / 감사 도구](#9-보안--감사-도구)
  - [10. 디버깅 / 시뮬레이션](#10-디버깅--시뮬레이션)
  - [11. 블록 익스플로러 / 검증](#11-블록-익스플로러--검증)
  - [12. 추천 초기 세팅 워크플로우](#12-추천-초기-세팅-워크플로우)
    - [🎯 시나리오 A — 신규 DeFi/프로토콜 (Foundry 단독)](#-시나리오-a--신규-defi프로토콜-foundry-단독)
    - [🎯 시나리오 B — 풀스택 dApp (Hardhat 3 + viem/wagmi)](#-시나리오-b--풀스택-dapp-hardhat-3--viemwagmi)
    - [🎯 시나리오 C — 하이브리드 (테스트는 Foundry, 배포는 Hardhat)](#-시나리오-c--하이브리드-테스트는-foundry-배포는-hardhat)
    - [🎯 시나리오 D — 학습/프로토타입](#-시나리오-d--학습프로토타입)
  - [13. AI 도구 사용 \& 페인 포인트 (Survey 2025)](#13-ai-도구-사용--페인-포인트-survey-2025)
    - [AI 도구](#ai-도구)
    - [컴파일러 페인 포인트 \& 우회책](#컴파일러-페인-포인트--우회책)
    - [가장 많이 요청된 컴파일러 기능 (2026 H1 로드맵)](#가장-많이-요청된-컴파일러-기능-2026-h1-로드맵)
  - [부록: 자주 쓰는 `.gitignore`](#부록-자주-쓰는-gitignore)
  - [부록: 모든 공식 링크 한눈에](#부록-모든-공식-링크-한눈에)
    - [프레임워크](#프레임워크)
    - [라이브러리](#라이브러리)
    - [SDK](#sdk)
    - [오라클](#오라클)
    - [Mantle](#mantle)
    - [RPC](#rpc)
    - [보안](#보안)
    - [디버깅/익스플로러](#디버깅익스플로러)

---

## 1. 기본 시스템 요구사항

| 항목              | 권장 버전                                                |
| ----------------- | -------------------------------------------------------- |
| Node.js           | LTS (v22.x 이상) — Hardhat/SDK용                         |
| npm / pnpm / yarn | pnpm 권장 (Hardhat 3가 pnpm 친화적)                      |
| Git               | 최신                                                     |
| Python 3          | Slither 등 보안 도구용 (선택)                            |
| OS                | macOS / Linux / WSL2 (Windows 네이티브는 Foundry 비공식) |

Windows 사용자: **WSL2 + Ubuntu** 권장. Foundryup은 Powershell/Cmd 미지원 → Git BASH 또는 WSL 필수.

---

## 2. 개발 프레임워크

### 2.1 Foundry

**Rust 기반 초고속 툴체인. 2026년 기본 선택.**
구성요소: `forge` (빌드/테스트), `cast` (체인 상호작용 CLI), `anvil` (로컬 노드), `chisel` (Solidity REPL).

**공식 링크**

- 홈: https://getfoundry.sh
- Book: https://book.getfoundry.sh
- GitHub: https://github.com/foundry-rs/foundry

**설치 (foundryup)**

```bash
# foundryup 설치
curl -L https://foundry.paradigm.xyz | bash

# 셸 재시작 후, 최신 stable 설치
foundryup

# 특정 버전 핀: foundryup -v <version>
# nightly: foundryup -i nightly
```

**프로젝트 초기화**

```bash
forge init my-project
cd my-project
forge build
forge test
```

**자주 쓰는 명령**

```bash
forge build              # 컴파일
forge test -vvv          # 테스트 (verbosity 3)
forge fmt                # 포맷팅
forge coverage           # 커버리지
forge snapshot           # 가스 스냅샷
cast call <addr> <sig>   # 컨트랙트 읽기
anvil                    # 로컬 노드 (포크 옵션 --fork-url ...)
```

---

### 2.2 Hardhat 3

**TypeScript 친화적 + Solidity 네이티브 테스트(Foundry 호환). 2026년 정식 출시.**

**공식 링크**

- 홈: https://hardhat.org
- What's new in v3: https://hardhat.org/docs/hardhat3/whats-new
- GitHub: https://github.com/NomicFoundation/hardhat
- npm: https://www.npmjs.com/package/hardhat
- VSCode 확장: https://hardhat.org/hardhat-vscode
- Ignition (Hardhat 모노레포에 통합됨, 구 레포는 2025-10 아카이브): https://github.com/NomicFoundation/hardhat/tree/main/packages/hardhat-ignition
- 보일러플레이트: https://github.com/NomicFoundation/hardhat-boilerplate

**설치 / 초기화**

```bash
# 빈 디렉터리에서 인터랙티브 초기화
mkdir my-dapp && cd my-dapp
npx hardhat --init
```

**주요 특징 (v3)**

- Foundry 호환 `*.t.sol` Solidity 테스트
- `--coverage` 빌트인 (Solidity + TS 모두)
- 빌드 프로파일 (`hardhat.config.ts`의 `profiles` 키)
- 선언적 설정, 타입드 아티팩트
- `foundry.toml` 파싱 + 아티팩트 공유 → Foundry와 혼합 워크플로우 가능
- 멀티체인/롤업 지원

**자주 쓰는 명령**

```bash
npx hardhat compile
npx hardhat test
npx hardhat test --coverage
npx hardhat node                  # 로컬 노드
npx hardhat ignition deploy ./...
```

---

### 2.3 Remix IDE

**브라우저 기반 IDE. 입문/프로토타입/교육용 표준.**

**공식 링크**

- 웹 IDE: https://remix.ethereum.org
- 문서: https://remix-ide.readthedocs.io
- GitHub: https://github.com/remix-project-org/remix-project
- VSCode 확장: https://github.com/ethereum/remix-vscode
- 플러그인 목록: https://remix-ide.readthedocs.io/en/latest/plugin_list.html

**빌트인 플러그인**

- Sourcify, Etherscan, Tenderly, Flattener, Gas Profiler, Hardhat 연동

설치 불필요 — 브라우저 접속만 하면 즉시 사용 가능. 데스크톱 앱도 GitHub Releases에서 제공.

---

## 3. 에디터 / IDE 확장

| 확장                                      | 설명                                                  | 링크                                                |
| ----------------------------------------- | ----------------------------------------------------- | --------------------------------------------------- |
| **Solidity (Juan Blanco)**                | VS Code 표준 Solidity 언어 지원                       | <https://github.com/juanfranblanco/vscode-solidity> |
| **Hardhat for VS Code**                   | NomicFoundation 공식. Hardhat + Foundry 프로젝트 통합 | <https://github.com/NomicFoundation/hardhat-vscode> |
| **Ethereum Remix**                        | Remix IDE를 VS Code 내에서                            | <https://github.com/ethereum/remix-vscode>          |
| **Even Better TOML**                      | `foundry.toml` 편집용                                 | Marketplace 검색                                    |
| **Solidity Visual Developer (tintinweb)** | 보안/감사 시각화                                      | Marketplace 검색                                    |

VS Code Marketplace 직접 검색:

- `JuanBlanco.solidity`
- `NomicFoundation.hardhat-solidity`
- `RemixProject.ethereum-remix`

---

## 4. 스마트 컨트랙트 라이브러리

### 4.1 OpenZeppelin Contracts

**가장 널리 쓰이는 표준 컨트랙트 라이브러리. ERC20/721/1155, AccessControl, Upgradeable 등.**

- GitHub: https://github.com/OpenZeppelin/openzeppelin-contracts
- npm: https://www.npmjs.com/package/@openzeppelin/contracts
- 문서: https://docs.openzeppelin.com/contracts
- Upgradeable: https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable
- Wizard: https://wizard.openzeppelin.com

**Hardhat 설치**

```bash
npm install @openzeppelin/contracts
# 또는 upgradeable
npm install @openzeppelin/contracts-upgradeable
```

**Foundry 설치**

```bash
forge install OpenZeppelin/openzeppelin-contracts
forge install OpenZeppelin/openzeppelin-contracts-upgradeable
```

`remappings.txt` (Foundry 기준):

```
@openzeppelin/=lib/openzeppelin-contracts/
```

---

### 4.2 Solady

**Vectorized 작성. 극도로 가스 최적화된 어셈블리 기반 스니펫. Solmate(유지보수 중단)의 후속작.**
**2026년 DeFi 프로토콜에서 선호되는 모던 가스 최적화 라이브러리.**

- GitHub: <https://github.com/Vectorized/solady>
- npm: <https://www.npmjs.com/package/solady>

**설치**

```bash
# Hardhat
npm install solady

# Foundry
forge install Vectorized/solady
```

---

### 4.3 forge-std

**Foundry용 표준 라이브러리 (테스트 헬퍼, `Test`, `Vm`, `console`, `StdCheats` 등). 모든 Foundry 프로젝트의 기본 의존성.**

- GitHub: <https://github.com/foundry-rs/forge-std>

```bash
forge install foundry-rs/forge-std
```

remapping:

```
forge-std/=lib/forge-std/src/
```

---

### 4.4 PRBMath

**고정소수점 수학 라이브러리 (UD60x18, SD59x18). DeFi에서 정밀 계산용.**

- GitHub: <https://github.com/PaulRBerg/prb-math>
- npm: <https://www.npmjs.com/package/@prb/math>

```bash
# Hardhat
npm install @prb/math

# Foundry
forge install PaulRBerg/prb-math
```

---

## 5. 클라이언트 SDK (JS/TS)

### 5.1 ethers.js

**가장 널리 쓰이는 Ethereum 클라이언트 라이브러리 (70% 점유율).**

- 홈페이지: <https://docs.ethers.org>
- GitHub: <https://github.com/ethers-io/ethers.js>
- npm: <https://www.npmjs.com/package/ethers>

```bash
npm install ethers
```

---

### 5.2 viem

**TypeScript-first, 트리 셰이킹 친화적 저수준 Ethereum 인터페이스. wagmi 팀(wevm) 작성.**

- 홈페이지: <https://viem.sh>
- 문서: <https://viem.sh/docs/introduction>
- GitHub: <https://github.com/wevm/viem>
- npm: <https://www.npmjs.com/package/viem>

```bash
npm install viem
```

---

### 5.3 wagmi

**React Hooks for Ethereum. viem 기반.**

- 홈페이지: <https://wagmi.sh>
- GitHub: <https://github.com/wevm/wagmi>
- npm: <https://www.npmjs.com/package/wagmi>

```bash
# React 프로젝트
pnpm add wagmi viem @tanstack/react-query
```

**기본 설정 예시**

```ts
import { createConfig, http } from 'wagmi';
import { mainnet, base, optimism, arbitrum } from 'wagmi/chains';

export const config = createConfig({
  chains: [mainnet, base, optimism, arbitrum],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
  },
});
```

---

## 6. 오라클 / Chainlink

**가격 피드, VRF (랜덤), Automation (Keepers), CCIP (크로스체인) 등.**

- 홈페이지: <https://chain.link>
- 개발자 문서: <https://docs.chain.link>
- Contracts GitHub: <https://github.com/smartcontractkit/chainlink>
- Docs GitHub: <https://github.com/smartcontractkit/documentation>
- npm: <https://www.npmjs.com/package/@chainlink/contracts>

**설치**

```bash
# Hardhat
npm install @chainlink/contracts

# Foundry
forge install smartcontractkit/chainlink-brownie-contracts
```

**Price Feed 주소 모음**: <https://docs.chain.link/data-feeds/price-feeds/addresses>

---

## 7. RPC 제공자 / 노드

### 메이저 상용 제공자

| 제공자                    | 특징                                                        | 링크                        |
| ------------------------- | ----------------------------------------------------------- | --------------------------- |
| **Alchemy**               | 30M CU/월 무료, archive 무료. 가장 풍부한 보조 API          | <https://www.alchemy.com>   |
| **Infura** (ConsenSys)    | 오랜 업력, MetaMask 백엔드                                  | <https://www.infura.io>     |
| **QuickNode**             | 50M credit/월 무료. 2026년 3월부터 Flat Rate RPS ($799/월~) | <https://www.quicknode.com> |
| **Chainstack**            | 3M req/월 무료                                              | <https://chainstack.com>    |
| **Ankr**                  | 200M credit 무료, 80+ 체인                                  | <https://www.ankr.com/rpc>  |
| **dRPC**                  | 110+ 체인 무료                                              | <https://drpc.org>          |
| **Tenderly Web3 Gateway** | 시뮬레이션 통합                                             | <https://tenderly.co>       |

### 공개 무료 엔드포인트 (개발/테스트용, 프로덕션 비권장)

- **ChainList**: <https://chainlist.org> — 체인 ID + 공개 RPC 모음
- **dRPC Chainlist**: <https://drpc.org/chainlist>
- **Ankr Public**: <https://www.ankr.com/rpc/eth/>
- **PublicNode**: <https://ethereum.publicnode.com>
- **LlamaNodes**: <https://llamarpc.com>

### 권장 패턴

프로덕션에서는 **최소 2개 제공자 + 자동 failover**.

- 1차: Alchemy 또는 QuickNode (퍼포먼스)
- 2차: dRPC 또는 Ankr (비용/이중화)

`.env` 예시:

```
MAINNET_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/<KEY>
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/<KEY>
BASE_RPC_URL=https://base-mainnet.g.alchemy.com/v2/<KEY>
MANTLE_RPC_URL=https://rpc.mantle.xyz
ETHERSCAN_API_KEY=<KEY>
MANTLESCAN_API_KEY=<KEY>
```

---

## 8. Mantle (L2)

Ethereum L2. Optimistic rollup 실행 레이어 + 모듈러 데이터 가용성(EigenDA/Mantle DA). 네이티브 가스 토큰은 **MNT**. 표준 Ethereum JSON-RPC 호환 → 기존 Solidity/Foundry/Hardhat 툴체인 그대로 사용.

### 체인 정보

| 항목          | Mainnet                                               | Sepolia Testnet                   |
| ------------- | ----------------------------------------------------- | --------------------------------- |
| Chain ID      | 5000                                                  | 5003                              |
| 네이티브 토큰 | MNT                                                   | MNT                               |
| 공식 RPC      | https://rpc.mantle.xyz                                | https://rpc.sepolia.mantle.xyz    |
| 익스플로러    | https://mantlescan.xyz (또는 https://mantlescan.info) | https://sepolia.mantlescan.xyz    |
| 브리지        | https://bridge.mantle.xyz                             | https://bridge.sepolia.mantle.xyz |

### 공식 링크

- 홈: https://www.mantle.xyz
- 개발자 문서: https://docs.mantle.xyz
- GitHub Org: https://github.com/mantlenetworkio
- 메인 모노레포: https://github.com/mantlenetworkio/mantle
- 튜토리얼 (cloneable 예제): https://github.com/mantlenetworkio/mantle-tutorial · https://mantlenetworkio.github.io/mantle-tutorial/
- ChainList 항목: https://chainlist.org/chain/5000

### 외부 RPC 제공자

- Alchemy: https://www.alchemy.com (Mantle 지원)
- QuickNode: https://www.quicknode.com/docs/mantle
- Ankr: https://www.ankr.com/docs/rpc-service/chains/chains-api/mantle/
- dRPC: https://drpc.org/chainlist/mantle-mainnet-rpc
- Dwellir: https://www.dwellir.com/docs/mantle

### Foundry로 배포

```bash
forge create src/MyContract.sol:MyContract \
  --rpc-url $MANTLE_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast
```

### Mantlescan 검증 (Hardhat)

`hardhat.config.ts`:

```ts
networks: {
  mantle: {
    url: process.env.MANTLE_RPC_URL!,
    accounts: [process.env.PRIVATE_KEY!],
    chainId: 5000,
  },
},
etherscan: {
  apiKey: {
    mantle: process.env.MANTLESCAN_API_KEY!,
  },
  customChains: [
    {
      network: "mantle",
      chainId: 5000,
      urls: {
        apiURL: "https://api.mantlescan.xyz/api",
        browserURL: "https://mantlescan.xyz",
      },
    },
  ],
},
```

### Foundry로 검증

```bash
forge verify-contract <addr> src/MyContract.sol:MyContract \
  --chain-id 5000 \
  --verifier etherscan \
  --verifier-url https://api.mantlescan.xyz/api \
  --etherscan-api-key $MANTLESCAN_API_KEY
```

---

## 9. 보안 / 감사 도구

| 도구               | 설명                                           | 링크                                   |
| ------------------ | ---------------------------------------------- | -------------------------------------- |
| **Slither**        | Solidity/Vyper 정적 분석 (Python). 사실상 표준 | <https://github.com/crytic/slither>    |
| **Echidna**        | 프로퍼티 기반 퍼저 (Haskell)                   | <https://github.com/crytic/echidna>    |
| **Medusa**         | Go 기반 차세대 퍼저 (Crytic)                   | <https://github.com/crytic/medusa>     |
| **Mythril**        | 심볼릭 실행 분석                               | <https://github.com/ConsenSys/mythril> |
| **Aderyn**         | Rust 기반 정적 분석기 (Cyfrin)                 | <https://github.com/Cyfrin/aderyn>     |
| **Halmos**         | 심볼릭 테스트 (a16z, Foundry 호환)             | <https://github.com/a16z/halmos>       |
| **Certora Prover** | 형식 검증 (상용)                               | <https://www.certora.com>              |
| **4naly3er**       | 가스 최적화 정적 분석                          | <https://github.com/Picodes/4naly3er>  |

**Slither 설치**

```bash
pip install slither-analyzer
slither .          # Foundry 또는 Hardhat 프로젝트에서 자동 감지
```

**Echidna 설치**

```bash
# Homebrew
brew install echidna

# Docker
docker pull trailofbits/eth-security-toolbox
```

---

## 10. 디버깅 / 시뮬레이션

| 도구                        | 설명                                                | 링크                           |
| --------------------------- | --------------------------------------------------- | ------------------------------ |
| **Tenderly**                | 트랜잭션 시뮬레이션, 디버거, 모니터링, Web3 Gateway | <https://tenderly.co>          |
| **Anvil**                   | Foundry 내장 로컬 노드, mainnet 포크 지원           | (Foundry에 포함)               |
| **Hardhat Network**         | Hardhat 내장 로컬 노드                              | (Hardhat에 포함)               |
| **OpenChain (구 Samczsun)** | 트랜잭션 트레이서                                   | <https://openchain.xyz>        |
| **Phalcon (BlockSec)**      | 트랜잭션 익스플로러/디버거                          | <https://phalcon.blocksec.com> |
| **dethcrypto/dethtools**    | 다양한 EVM 유틸                                     | <https://tools.deth.net>       |

---

## 11. 블록 익스플로러 / 검증

| 서비스                                                       | 용도                                   | 링크                         |
| ------------------------------------------------------------ | -------------------------------------- | ---------------------------- |
| **Etherscan**                                                | 컨트랙트 검증, ABI, 읽기/쓰기 UI       | <https://etherscan.io>       |
| **Sourcify**                                                 | 분산형 컨트랙트 검증 (메타데이터 매칭) | <https://sourcify.dev>       |
| **Blockscout**                                               | 오픈소스 익스플로러 (L2 다수가 채택)   | <https://www.blockscout.com> |
| **Mantlescan**                                               | Mantle L2 익스플로러 (Etherscan 호환)  | <https://mantlescan.xyz>     |
| **Basescan / Arbiscan / Optimistic Etherscan / Polygonscan** | L2별 Etherscan 인스턴스                | (각 도메인)                  |

**Foundry로 검증**

```bash
forge verify-contract <addr> src/Foo.sol:Foo \
  --chain-id 1 \
  --etherscan-api-key $ETHERSCAN_API_KEY
```

**Hardhat 검증** — `hardhat-verify` 플러그인 (Hardhat 3에 빌트인).

---

## 12. 추천 초기 세팅 워크플로우

### 🎯 시나리오 A — 신규 DeFi/프로토콜 (Foundry 단독)

```bash
# 1. Foundry 설치
curl -L https://foundry.paradigm.xyz | bash
foundryup

# 2. 프로젝트 초기화
forge init my-protocol
cd my-protocol

# 3. 핵심 라이브러리 설치
forge install OpenZeppelin/openzeppelin-contracts
forge install Vectorized/solady
forge install smartcontractkit/chainlink-brownie-contracts
forge install PaulRBerg/prb-math

# 4. remappings.txt 정리
cat > remappings.txt <<'EOF'
forge-std/=lib/forge-std/src/
@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/
solady/=lib/solady/src/
@chainlink/contracts/=lib/chainlink-brownie-contracts/contracts/
@prb/math/=lib/prb-math/src/
EOF

# 5. .env (gitignore!)
cat > .env <<'EOF'
MAINNET_RPC_URL=
SEPOLIA_RPC_URL=
ETHERSCAN_API_KEY=
PRIVATE_KEY=
EOF

# 6. 보안 도구
pip install slither-analyzer

# 7. 빌드/테스트
forge build
forge test -vvv
```

### 🎯 시나리오 B — 풀스택 dApp (Hardhat 3 + viem/wagmi)

```bash
# 1. 프로젝트 초기화
mkdir my-dapp && cd my-dapp
npx hardhat --init        # TypeScript, viem 선택

# 2. 컨트랙트 라이브러리
npm install @openzeppelin/contracts @chainlink/contracts

# 3. 프론트엔드 (별도 디렉터리 또는 모노레포)
pnpm add wagmi viem @tanstack/react-query

# 4. 환경변수
cat > .env <<'EOF'
ALCHEMY_API_KEY=
ETHERSCAN_API_KEY=
DEPLOYER_PRIVATE_KEY=
EOF
```

### 🎯 시나리오 C — 하이브리드 (테스트는 Foundry, 배포는 Hardhat)

Hardhat 3가 `foundry.toml`을 읽고 아티팩트를 공유하므로:

```bash
forge init my-project
cd my-project
npx hardhat --init        # 같은 디렉터리에 Hardhat 추가
# Hardhat 3가 foundry.toml 자동 감지
```

테스트: `forge test`. 배포: `npx hardhat ignition deploy ...`. 둘 다 같은 빌드 아티팩트 사용.

### 🎯 시나리오 D — 학습/프로토타입

1. <https://remix.ethereum.org> 접속 → 즉시 시작.
2. 익숙해지면 VS Code + Solidity 확장 + Foundry.

---

## 13. AI 도구 사용 & 페인 포인트 (Survey 2025)

**출처**

- Solidity Developer Survey 2025 결과: https://www.soliditylang.org/blog/2026/04/15/solidity-developer-survey-2025-results/
- Survey 2025 안내: https://www.soliditylang.org/blog/2026/02/10/solidity-developer-survey-2025-announcement/
- 과거 서베이 아카이브: https://www.soliditylang.org/blog/

### AI 도구

- **88%가 월 1회 이상, 58%가 매일 사용**. 하지만 **45%가 결과물 불신**.
- 잘 동작하는 영역: **테스트(61%), 문서화(59%), 코드베이스 탐색(58%)**.
- 신뢰 낮은 영역: 보안 크리티컬 로직, 어셈블리, 최신 EVM 기능, 정확한 가스 계산.
- 실무 패턴: AI 출력은 **초안**, 컨트랙트 본체 로직과 보안 결정은 사람이 책임.
- 흔한 조합: Cursor / Copilot / Claude Code (IDE) + Solidity 도메인 특화 도구.

### 컴파일러 페인 포인트 & 우회책

| 페인 포인트                    | 비율 | 우회책                                                                      |
| ------------------------------ | ---- | --------------------------------------------------------------------------- |
| Stack-too-deep                 | 47%  | `foundry.toml`에 `via_ir = true`, 블록 스코프로 변수 분리, 구조체로 묶기    |
| 바이트코드 24KB 한계 (EIP-170) | 33%  | 외부 라이브러리 분리, OpenZeppelin Upgradeable, Diamond Standard (EIP-2535) |
| 디버깅 어려움                  | 33%  | Foundry `forge test -vvvv` 트레이스, Tenderly 디버거                        |

`foundry.toml`에 흔히 추가하는 옵션:

```toml
[profile.default]
via_ir = true
optimizer = true
optimizer_runs = 200
```

### 가장 많이 요청된 컴파일러 기능 (2026 H1 로드맵)

- 더 나은 가스 최적화 (44%)
- EIP-712 typehash 지원 (29%)
- Transient storage 참조 타입 (23%) — 현재는 value 타입만 가능

Solidity 팀이 H1 2026에 Stack-too-deep 제거 / 성능 / 디버깅 모두 우선 타겟.

---

## 부록: 자주 쓰는 `.gitignore`

```gitignore
# Foundry
out/
cache/
broadcast/
.env

# Hardhat
node_modules/
artifacts/
cache/
typechain-types/
.env

# 공통
*.log
coverage/
lcov.info
```

---

## 부록: 모든 공식 링크 한눈에

### 프레임워크

- Foundry: <https://getfoundry.sh> · <https://github.com/foundry-rs/foundry> · <https://book.getfoundry.sh>
- Hardhat: <https://hardhat.org> · <https://github.com/NomicFoundation/hardhat> · <https://www.npmjs.com/package/hardhat>
- Remix: <https://remix.ethereum.org> · <https://github.com/remix-project-org/remix-project>

### 라이브러리

- OpenZeppelin: <https://github.com/OpenZeppelin/openzeppelin-contracts> · <https://www.npmjs.com/package/@openzeppelin/contracts>
- Solady: <https://github.com/Vectorized/solady>
- forge-std: <https://github.com/foundry-rs/forge-std>
- PRBMath: <https://github.com/PaulRBerg/prb-math>

### SDK

- ethers.js: <https://docs.ethers.org> · <https://github.com/ethers-io/ethers.js>
- viem: <https://viem.sh> · <https://github.com/wevm/viem>
- wagmi: <https://wagmi.sh> · <https://github.com/wevm/wagmi>

### 오라클

- Chainlink: <https://chain.link> · <https://docs.chain.link> · <https://github.com/smartcontractkit/chainlink>

### Mantle

- 홈/문서: <https://www.mantle.xyz> · <https://docs.mantle.xyz>
- GitHub Org: <https://github.com/mantlenetworkio>
- RPC: https://rpc.mantle.xyz (chain ID 5000)
- 익스플로러: <https://mantlescan.xyz>
- 브리지: <https://bridge.mantle.xyz>

### RPC

- ChainList: <https://chainlist.org>
- Alchemy: <https://www.alchemy.com>
- Infura: <https://www.infura.io>
- QuickNode: <https://www.quicknode.com>
- Ankr: <https://www.ankr.com/rpc>
- dRPC: <https://drpc.org>

### 보안

- Slither: <https://github.com/crytic/slither>
- Echidna: <https://github.com/crytic/echidna>
- Medusa: <https://github.com/crytic/medusa>
- Mythril: <https://github.com/ConsenSys/mythril>
- Aderyn: <https://github.com/Cyfrin/aderyn>
- Halmos: <https://github.com/a16z/halmos>

### 디버깅/익스플로러

- Tenderly: <https://tenderly.co>
- Etherscan: <https://etherscan.io>
- Sourcify: <https://sourcify.dev>
- Blockscout: <https://www.blockscout.com>
