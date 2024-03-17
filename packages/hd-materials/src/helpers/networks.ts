export enum Chains {
  MAINNET = "0x1",
  RINKEBY = "0x4",
  ROPSTEN = "0x3",
  GOERLY = "0x5",
  KOVAN = "0x2a",
  POLYGON = "0x89",
  MUMBAI = "0x13881",
  BINANCE_SMART_CHAIN = "0x38",
  BINANCE_SMART_CHAIN_TESTNET = "0x61",
  AVALANCHE = "0xa86a",
  AVALANCHE_TESTNET = "0xa869",
  FANTOM = "0xfa",
  FANTOM_TESTNET = "0xfa2",
  ARBITRUM = "0xa4b1",
  ARBITRUM_TESTNET = "0x66eeb",
}

interface NetworkConfig {
  chainId: string;
  chainName: string;
  currencyName: string;
  currencySymbol: string;
  apiKey: string;
  apiUrl: string;
  blockExplorerUrl: string;
  rpcUrl?: string;
  wrapped?: string;
}

export const networkConfigs: { [key in Chains]: NetworkConfig } = {
  [Chains.MAINNET]: {
    chainId: Chains.MAINNET,
    chainName: "mainnet",
    currencyName: "ETH",
    currencySymbol: "ETH",
    apiKey: "REACT_APP_ETHERSCAN_API_KEY",
    apiUrl: "https://api.etherscan.io/api",
    blockExplorerUrl: "https://etherscan.io/",
    wrapped: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  },
  [Chains.RINKEBY]: {
    chainId: Chains.RINKEBY,
    chainName: "rinkeby",
    currencyName: "ETH",
    currencySymbol: "ETH",
    apiKey: "REACT_APP_ETHERSCAN_API_KEY",
    apiUrl: "https://api-rinkeby.etherscan.io/api",
    blockExplorerUrl: "https://rinkeby.etherscan.io/",
  },
  [Chains.ROPSTEN]: {
    chainId: Chains.ROPSTEN,
    chainName: "ropsten",
    currencyName: "ETH",
    currencySymbol: "ETH",
    apiKey: "REACT_APP_ETHERSCAN_API_KEY",
    apiUrl: "https://api-ropsten.etherscan.io/api",
    blockExplorerUrl: "https://ropsten.etherscan.io/",
  },
  [Chains.GOERLY]: {
    chainId: Chains.GOERLY,
    chainName: "goerli",
    currencyName: "ETH",
    currencySymbol: "ETH",
    apiKey: "REACT_APP_ETHERSCAN_API_KEY",
    apiUrl: "https://api-goerli.etherscan.io/api",
    blockExplorerUrl: "https://goerli.etherscan.io/",
  },
  [Chains.KOVAN]: {
    chainId: Chains.KOVAN,
    chainName: "kovan",
    currencyName: "ETH",
    currencySymbol: "ETH",
    apiKey: "REACT_APP_ETHERSCAN_API_KEY",
    apiUrl: "https://api-kovan.etherscan.io/api",
    blockExplorerUrl: "https://kovan.etherscan.io/",
  },
  [Chains.POLYGON]: {
    chainId: Chains.POLYGON,
    chainName: "Polygon Mainnet",
    currencyName: "MATIC",
    currencySymbol: "MATIC",
    apiKey: "REACT_APP_POLYGONSCAN_API_KEY",
    apiUrl: "https://api.polygonscan.com/api",
    blockExplorerUrl: "https://explorer-mainnet.maticvigil.com/",
    rpcUrl: "https://polygon-rpc.com/",
    wrapped: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
  },
  [Chains.MUMBAI]: {
    chainId: Chains.MUMBAI,
    chainName: "Mumbai",
    currencyName: "MATIC",
    currencySymbol: "MATIC",
    apiKey: "REACT_APP_POLYGONSCAN_API_KEY",
    apiUrl: "https://api-testnet.polygonscan.com/api",
    blockExplorerUrl: "https://mumbai.polygonscan.com/",
    rpcUrl: "https://matic-mumbai.chainstacklabs.com/",
  },
  [Chains.BINANCE_SMART_CHAIN]: {
    chainId: Chains.BINANCE_SMART_CHAIN,
    chainName: "Binance Smart Chain",
    currencyName: "BNB",
    currencySymbol: "BNB",
    apiKey: "REACT_APP_BSCSCAN_API_KEY",
    apiUrl: "https://api.bscscan.com/api",
    blockExplorerUrl: "https://bscscan.com/",
    rpcUrl: "https://bsc-dataseed.binance.org/",
    wrapped: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  },
  [Chains.BINANCE_SMART_CHAIN_TESTNET]: {
    chainId: Chains.BINANCE_SMART_CHAIN_TESTNET,
    chainName: "Binance Smart Chain - Testnet",
    currencyName: "BNB",
    currencySymbol: "BNB",
    apiKey: "REACT_APP_BSCSCAN_API_KEY",
    apiUrl: "https://api-testnet.bscscan.com/api",
    blockExplorerUrl: "https://testnet.bscscan.com/",
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  },
  [Chains.AVALANCHE]: {
    chainId: Chains.AVALANCHE,
    chainName: "Avalanche Mainnet",
    currencyName: "AVAX",
    currencySymbol: "AVAX",
    apiKey: "REACT_APP_SNOWTRACE_API_KEY",
    apiUrl: "https://api.snowtrace.io/api",
    blockExplorerUrl: "https://snowtrace.io/",
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
  },
  [Chains.AVALANCHE_TESTNET]: {
    chainId: Chains.AVALANCHE_TESTNET,
    chainName: "Avalanche Testnet",
    currencyName: "AVAX",
    currencySymbol: "AVAX",
    apiKey: "REACT_APP_SNOWTRACE_API_KEY",
    apiUrl: "https://api-testnet.snowtrace.io/api",
    blockExplorerUrl: "https://testnet.snowtrace.io/",
    rpcUrl: "https://api.avax-test.network/ext/bc/C/rpc",
  },
  [Chains.FANTOM]: {
    chainId: Chains.FANTOM,
    chainName: "Fantom Opera",
    currencyName: "FTM",
    currencySymbol: "FTM",
    apiKey: "REACT_APP_FTMSCAN_API_KEY",
    apiUrl: "https://api.ftmscan.com/api",
    blockExplorerUrl: "https://ftmscan.com/",
    rpcUrl: "https://rpcapi.fantom.network/",
  },
  [Chains.FANTOM_TESTNET]: {
    chainId: Chains.FANTOM_TESTNET,
    chainName: "Fantom Testnet",
    currencyName: "FTM",
    currencySymbol: "FTM",
    apiKey: "REACT_APP_FTMSCAN_API_KEY",
    apiUrl: "https://api-testnet.ftmscan.com/api",
    blockExplorerUrl: "https://testnet.ftmscan.com/",
    rpcUrl: "https://rpc.testnet.fantom.network/",
  },
  [Chains.ARBITRUM]: {
    chainId: Chains.ARBITRUM,
    chainName: "Arbitrum",
    currencyName: "ETH",
    currencySymbol: "ETH",
    apiKey: "REACT_APP_ARBISCAN_API_KEY",
    apiUrl: "https://api.arbiscan.io/api",
    blockExplorerUrl: "https://arbiscan.io/",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
  },
  [Chains.ARBITRUM_TESTNET]: {
    chainId: Chains.ARBITRUM_TESTNET,
    chainName: "Arbitrum Testnet",
    currencyName: "ETH",
    currencySymbol: "ETH",
    apiKey: "REACT_APP_ARBISCAN_API_KEY",
    apiUrl: "https://api-testnet.arbiscan.io/api",
    blockExplorerUrl: "https://testnet.arbiscan.io/",
    rpcUrl: "https://rinkeby.arbitrum.io/rpc",
  },
};

export const getNativeByChain = (chain: Chains): string => {
  return networkConfigs[chain]?.currencySymbol || "NATIVE";
};

export const getChainName = (chain: Chains): string => {
  return networkConfigs[chain]?.chainName || "";
};

export const getChainById = (chain: Chains): string => {
  return `${networkConfigs[chain]?.chainId || ""}`;
};

export const getExplorer = (chain: string): string => {
  return networkConfigs[chain as Chains]?.blockExplorerUrl || "";
};

export const getWrappedNative = (chain: Chains): string => {
  return networkConfigs[chain]?.wrapped || "";
};
