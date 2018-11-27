export declare const BITCOIN: {
    name: string;
    messagePrefix: string;
    bip32: {
        private: number;
        public: number;
    };
    bip: number;
    pubKeyHash: number;
    scriptHash: number;
    wif: number;
};
export declare const BITCOIN_TESTNET: {
    name: string;
    messagePrefix: string;
    bech32: string;
    bip32: {
        public: number;
        private: number;
    };
    bip: number;
    pubKeyHash: number;
    scriptHash: number;
    wif: number;
};
export declare const LITECOIN: {
    name: string;
    messagePrefix: string;
    bip32: {
        public: number;
        private: number;
    };
    bip: number;
    pubKeyHash: number;
    scriptHash: number;
    wif: number;
};
export declare const LITECOIN_TESTNET: {
    name: string;
    messagePrefix: string;
    bip32: {
        private: number;
        public: number;
    };
    bip: number;
    pubKeyHash: number;
    scriptHash: number;
    wif: number;
};
export declare const DOGECOIN: {
    name: string;
    bip32: {
        private: number;
        public: number;
    };
    bip: number;
    wif: number;
    public: number;
    scripthash: number;
};
export declare const DOGECOIN_TESTNET: {
    name: string;
    bip32: {
        private: number;
        public: number;
    };
    bip: number;
    wif: number;
    public: number;
    scripthash: number;
};
export declare const ETHEREUM: {
    name: string;
    bip: number;
};
