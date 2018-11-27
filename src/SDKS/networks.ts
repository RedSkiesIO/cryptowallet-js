export const BITCOIN = {
    name: 'Bitcoin',
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bip32: {
        private: 0x0488ade4,
        public: 0x0488b21e
    },
    bip: 0,
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0x80
}



export const LITECOIN = {
    name: 'Litecoin',
    messagePrefix: '\x19Litecoin Signed Message:\n',
    bip32: {
        public: 0x019da462,
        private: 0x019d9cfe
    },
    bip: 2,
    pubKeyHash: 0x30,
    scriptHash: 0x32,
    wif: 0xb0
}

export const LITECOIN_TESTNET = {
    name: 'Litecoin Testnet',
    messagePrefix: '\x19Litecoin Signed Message:\n',
    bip32: {
        private: 0x0436ef7d,
        public: 0x0436f6e1
    },
    bip: 1,
    pubKeyHash: 0x6f,
    scriptHash: 0x3a,
    wif: 0xef
}

export const DOGECOIN = {
    name: 'Dogecoin',
    bip32: {
        private: 0x02fac398,
        public: 0x02facafd
    },
    bip: 3,
    wif: 0x9e,
    public: 0x1e,
    scripthash: 0x16
}

export const DOGECOIN_TESTNET = {
    name: 'Dogecoin Testnet',
    bip32: {
        private: 0x0432a243,
        public: 0x0432a9a8
    },
    bip: 1,
    wif: 0xf1,
    public: 0x71,
    scripthash: 0xc4,
    connect: {
        bip32: {
            private: 0x0432a243,
            public: 0x0432a9a8
        },
        bip: 1,
        wif: 0xf1,
        public: 0x71,
        scripthash: 0xc4
    }
}

export const ETHEREUM = {
    name: 'Ethereum',
    bip: 60
}

export const testnet = {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'tb',
    bip32: {
        public: 0x043587cf,
        private: 0x04358394
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef
}

export const BITCOIN_TESTNET = {
    name: 'Bitcoin Testnet',
    bip: 1,
    apiUrl: 'https://chain.so/api/v2/get_tx_unspent/BTCTEST/',
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'tb',
    bip32: {
        public: 0x043587cf,
        private: 0x04358394
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef,
    connect: {

        messagePrefix: '\x18Bitcoin Signed Message:\n',
        bech32: 'tb',
        bip32: {
            public: 0x043587cf,
            private: 0x04358394
        },
        pubKeyHash: 0x6f,
        scriptHash: 0xc4,
        wif: 0xef
    }
}
