declare module "eth-chainlist" {
  export interface ChainNativeCurrency {
    name: string;
    symbol: string;
    decimals: number;
  }

  export interface ChainExplorer {
    name: string;
    url: string;
    standard?: string;
  }

  export interface Chain {
    name: string;
    chain: string;
    icon?: string;
    rpc: string[];
    faucets: string[];
    nativeCurrency: ChainNativeCurrency;
    infoURL: string;
    shortName: string;
    chainId: number;
    networkId: number;
    slip44?: number;
    explorers?: ChainExplorer[];
    parent?: Record<string, unknown>;
  }

  export function rawChainData(): Chain[];
  export function getChainById(chainId: number): Chain | undefined;
  export function getChainByNetworkId(networkId: number): Chain | undefined;
  export function getChainByName(name: string): Chain | undefined;
  export function getChainByShortName(shortName: string): Chain | undefined;

  const _default: {
    rawChainData: typeof rawChainData;
    getChainById: typeof getChainById;
    getChainByNetworkId: typeof getChainByNetworkId;
    getChainByName: typeof getChainByName;
    getChainByShortName: typeof getChainByShortName;
  };
  export default _default;
}
