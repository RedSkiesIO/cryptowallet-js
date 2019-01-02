"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.token = 'token=f4d997113b76452393a65216e046ab77';
exports.ethToken = '2JAADVNZG512YIZSCF7S6JDXS8QI7PSUFY';
exports.BITCOIN = {
    name: 'Bitcoin',
    bip: 0,
    segwit: true,
    feeApi: 'https://api.blockcypher.com/v1/btc/main',
    connect: {
        messagePrefix: '\x18Bitcoin Signed Message:\n',
        bech32: 'bc',
        bip32: {
            private: 0x0488ade4,
            public: 0x0488b21e,
        },
        pubKeyHash: 0x00,
        scriptHash: 0x05,
        wif: 0x80,
    },
};
exports.LITECOIN = {
    name: 'Litecoin',
    bip: 2,
    segwit: true,
    feeApi: 'https://api.blockcypher.com/v1/ltc/main',
    connect: {
        messagePrefix: '\x19Litecoin Signed Message:\n',
        bip32: {
            public: 0x019da462,
            private: 0x019d9cfe,
        },
        pubKeyHash: 0x30,
        scriptHash: 0x32,
        wif: 0xb0,
    },
};
exports.LITECOIN_TESTNET = {
    name: 'Litecoin Testnet',
    type: 'litecoin testnet',
    bip: 1,
    segwit: true,
    feeApi: 'https://api.blockcypher.com/v1/ltc/main',
    discovery: 'https://testnet.litecore.io/api',
    broadcastUrl: 'https://chain.so/api/v2/send_tx/LTCTEST',
    connect: {
        messagePrefix: '\x19Litecoin Signed Message:\n',
        bip32: {
            private: 0x0436ef7d,
            public: 0x0436f6e1,
        },
        pubKeyHash: 0x6f,
        scriptHash: 0x3a,
        wif: 0xef,
    },
};
exports.DASH = {
    name: 'Dash',
    bip: 5,
    segwit: false,
    feeApi: 'https://api.blockcypher.com/v1/dash/main',
    connect: {
        messagePrefix: 'unused',
        bip32: {
            public: 0x0488b21e,
            private: 0x0488ade4,
        },
        pubKeyHash: 0x4c,
        scriptHash: 0x10,
        wif: 0xcc,
    },
};
exports.DASH_TESTNET = {
    name: 'Dash Testnet',
    bip: 1,
    segwit: false,
    discovery: 'https://testnet-insight.dashevo.org/insight-api',
    broadcastUrl: 'https://chain.so/api/v2/send_tx/DASHTEST',
    feeApi: 'https://api.blockcypher.com/v1/dash/main',
    connect: {
        messagePrefix: 'unused',
        bip32: {
            public: 0x043587cf,
            private: 0x04358394,
        },
        pubKeyHash: 0x8c,
        scriptHash: 0x13,
        wif: 0xef,
    },
};
exports.DOGECOIN = {
    name: 'Dogecoin',
    bip: 3,
    segwit: false,
    connect: {
        messagePrefix: '\x19Dogecoin Signed Message:\n',
        bip32: {
            public: 0x02facafd,
            private: 0x02fac398,
        },
        pubKeyHash: 0x1e,
        scriptHash: 0x16,
        wif: 0x9e,
    },
};
exports.DOGECOIN_TESTNET = {
    name: 'Dogecoin Testnet',
    bip: 1,
    segwit: false,
    connect: {
        messagePrefix: '\x18Dogecoin Signed Message:\n',
        bip32: {
            private: 0x0432a243,
            public: 0x0432a9a8,
        },
        wif: 0xf1,
        public: 0x71,
        scripthash: 0xc4,
    },
};
exports.VIACOIN = {
    name: 'Viacoin',
    segwit: false,
    connect: {
        messagePrefix: '\x18Viacoin Signed Message:\n',
        bip32: {
            public: 0x0488b21e,
            private: 0x0488ade4,
        },
        pubKeyHash: 0x47,
        scriptHash: 0x21,
        wif: 0xc7,
    },
};
exports.VIACOIN_TESTNET = {
    name: 'Viacoin Testnet',
    segwit: false,
    connect: {
        messagePrefix: '\x18Viacoin Signed Message:\n',
        bip32: {
            public: 0x043587cf,
            private: 0x04358394,
        },
        pubKeyHash: 0x7f,
        scriptHash: 0xc4,
        wif: 0xff,
    },
};
exports.ETHEREUM = {
    name: 'Ethereum',
    bip: 60,
    sendTxApi: 'https://api.blockcypher.com/v1/eth/main/txs/push',
    chainId: 1,
};
exports.ETHEREUM_CLASSIC = {
    name: 'Ethereum Classic',
    bip: 61,
    provider: 'https://ethereumclassic.network',
    chainId: 1,
};
exports.ETHEREUM_ROPSTEN = {
    name: 'Ethereum Ropsten',
    networkName: 'ropsten',
    bip: 60,
    sendTxApi: 'https://api.blockcypher.com/v1/eth/main/txs/push',
    getTranApi: 'http://api-ropsten.etherscan.io/api?module=account&action=txlist&address=',
    getBalanceApi: 'https://api-ropsten.etherscan.io/api?module=account&action=balance&address=',
    getErc20TranApi: 'http://api-ropsten.etherscan.io/api?module=account&action=tokentx&contractaddress=',
    provider: 'https://ropsten.infura.io/v3/352fc30cd8364caabaea4a3d67da773f',
    chainId: 3,
};
exports.BITCOIN_TESTNET = {
    name: 'Bitcoin Testnet',
    type: 'testnet',
    bip: 1,
    segwit: true,
    discovery: 'https://test-insight.bitpay.com/api',
    broadcastUrl: 'https://chain.so/api/v2/send_tx/BTCTEST',
    sendTxApi: 'https://api.blockcypher.com/v1/btc/test3/txs/push',
    getTranApi: 'https://api.blockcypher.com/v1/btc/test3/addrs/',
    decodeTxApi: 'https://api.blockcypher.com/v1/btc/test3/txs/decode',
    feeApi: 'https://api.blockcypher.com/v1/btc/main',
    connect: {
        messagePrefix: '\x18Bitcoin Signed Message:\n',
        bech32: 'tb',
        bip32: {
            public: 0x043587cf,
            private: 0x04358394,
        },
        pubKeyHash: 0x6f,
        scriptHash: 0xc4,
        wif: 0xef,
    },
};
exports.REGTEST = {
    name: 'Regtest',
    type: 'test',
    discovery: 'http://192.168.1.195:3001/api',
    segwit: false,
    feeApi: 'https://api.blockcypher.com/v1/btc/main',
    connect: {
        messagePrefix: '\x18Bitcoin Signed Message:\n',
        bech32: 'bcrt',
        bip32: {
            public: 0x043587cf,
            private: 0x04358394,
        },
        pubKeyHash: 0x6f,
        scriptHash: 0xc4,
        wif: 0xef,
    },
};
