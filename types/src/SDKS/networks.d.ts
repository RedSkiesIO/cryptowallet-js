export declare const token = "token=f4d997113b76452393a65216e046ab77";
export declare const ethToken = "2JAADVNZG512YIZSCF7S6JDXS8QI7PSUFY";
export declare const BITCOIN: {
    name: string;
    bip: number;
    segwit: boolean;
    discovery: string;
    broadcastUrl: string;
    feeApi: string;
    connect: {
        messagePrefix: string;
        bech32: string;
        bip32: {
            private: number;
            public: number;
        };
        pubKeyHash: number;
        scriptHash: number;
        wif: number;
    };
};
export declare const BITCOIN_TESTNET: {
    name: string;
    type: string;
    bip: number;
    segwit: boolean;
    discovery: string;
    broadcastUrl: string;
    sendTxApi: string;
    getTranApi: string;
    decodeTxApi: string;
    feeApi: string;
    connect: {
        messagePrefix: string;
        bech32: string;
        bip32: {
            public: number;
            private: number;
        };
        pubKeyHash: number;
        scriptHash: number;
        wif: number;
    };
};
export declare const LITECOIN: {
    name: string;
    bip: number;
    segwit: boolean;
    discovery: string;
    broadcastUrl: string;
    feeApi: string;
    connect: {
        messagePrefix: string;
        bip32: {
            public: number;
            private: number;
        };
        pubKeyHash: number;
        scriptHash: number;
        wif: number;
    };
};
export declare const LITECOIN_TESTNET: {
    name: string;
    type: string;
    bip: number;
    segwit: boolean;
    feeApi: string;
    discovery: string;
    broadcastUrl: string;
    connect: {
        messagePrefix: string;
        bip32: {
            private: number;
            public: number;
        };
        pubKeyHash: number;
        scriptHash: number;
        wif: number;
    };
};
export declare const DASH: {
    name: string;
    bip: number;
    segwit: boolean;
    discovery: string;
    feeApi: string;
    connect: {
        messagePrefix: string;
        bip32: {
            public: number;
            private: number;
        };
        pubKeyHash: number;
        scriptHash: number;
        wif: number;
    };
};
export declare const DASH_TESTNET: {
    name: string;
    bip: number;
    segwit: boolean;
    discovery: string;
    feeApi: string;
    connect: {
        messagePrefix: string;
        bip32: {
            public: number;
            private: number;
        };
        pubKeyHash: number;
        scriptHash: number;
        wif: number;
    };
};
export declare const DOGECOIN: {
    name: string;
    bip: number;
    segwit: boolean;
    connect: {
        messagePrefix: string;
        bip32: {
            public: number;
            private: number;
        };
        pubKeyHash: number;
        scriptHash: number;
        wif: number;
    };
};
export declare const DOGECOIN_TESTNET: {
    name: string;
    bip: number;
    segwit: boolean;
    connect: {
        messagePrefix: string;
        bip32: {
            private: number;
            public: number;
        };
        wif: number;
        public: number;
        scripthash: number;
    };
};
export declare const VIACOIN: {
    name: string;
    segwit: boolean;
    connect: {
        messagePrefix: string;
        bip32: {
            public: number;
            private: number;
        };
        pubKeyHash: number;
        scriptHash: number;
        wif: number;
    };
};
export declare const VIACOIN_TESTNET: {
    name: string;
    segwit: boolean;
    connect: {
        messagePrefix: string;
        bip32: {
            public: number;
            private: number;
        };
        pubKeyHash: number;
        scriptHash: number;
        wif: number;
    };
};
export declare const ETHEREUM: {
    name: string;
    bip: number;
    sendTxApi: string;
    feeApi: string;
    provider: string;
    chainId: number;
};
export declare const ETHEREUM_CLASSIC: {
    name: string;
    bip: number;
    provider: string;
    chainId: number;
};
export declare const ETHEREUM_ROPSTEN: {
    name: string;
    networkName: string;
    bip: number;
    getTranApi: string;
    getBalanceApi: string;
    getErc20TranApi: string;
    provider: string;
    feeApi: string;
    chainId: number;
};
export declare const ETHEREUM_RINKEBY: {
    name: string;
    networkName: string;
    bip: number;
    getTranApi: string;
    getBalanceApi: string;
    getErc20TranApi: string;
    provider: string;
    feeApi: string;
    chainId: number;
};
export declare const ETHEREUM_KOVAN: {
    name: string;
    networkName: string;
    bip: number;
    getTranApi: string;
    getBalanceApi: string;
    getErc20TranApi: string;
    provider: string;
    feeApi: string;
    chainId: number;
};
export declare const REGTEST: {
    name: string;
    type: string;
    discovery: string;
    segwit: boolean;
    feeApi: string;
    connect: {
        messagePrefix: string;
        bech32: string;
        bip32: {
            public: number;
            private: number;
        };
        pubKeyHash: number;
        scriptHash: number;
        wif: number;
    };
};
