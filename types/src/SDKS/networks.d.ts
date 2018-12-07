export declare const token = "token=f4d997113b76452393a65216e046ab77";
export declare const ethToken = "2JAADVNZG512YIZSCF7S6JDXS8QI7PSUFY";
export declare const BITCOIN: {
    name: string;
    bip: number;
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
export declare const LITECOIN: {
    name: string;
    bip: number;
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
    bip: number;
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
export declare const DOGECOIN: {
    name: string;
    bip: number;
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
export declare const DOGECOIN_TESTNET: {
    name: string;
    bip: number;
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
export declare const ETHEREUM: {
    name: string;
    bip: number;
    sendTxApi: string;
};
export declare const ETHEREUM_ROPSTEN: {
    name: string;
    networkName: string;
    bip: number;
    sendTxApi: string;
    getTranApi: string;
    provider: string;
};
export declare const BITCOIN_TESTNET: {
    name: string;
    bip: number;
    apiUrl: string;
    sendTxApi: string;
    getTranApi: string;
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
