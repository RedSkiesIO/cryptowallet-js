/**
* Copyright (c) 2019 https://atlascity.io
*
* This file is part of CryptoWallet-js <https://github.com/atlascity/cryptowallet-js>
*
* CryptoWallet-js is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 2 of the License, or
* (at your option) any later version.
*
* CryptoWallet-js is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with CryptoWallet-js. If not, see <https://www.gnu.org/licenses/>.
*/
export const ethToken = process.env.ETHERSCAN_API_KEY;
export const cryptocompare = process.env.CRYPTOCOMPARE_API_KEY;
export const BITCOIN = {
    name: 'BITCOIN',
    bip: 0,
    segwit: true,
    discovery: process.env.BITCOIN_DISCOVERY,
    broadcastUrl: process.env.BITCOIN_BROADCAST,
    feeApi: process.env.BITCOIN_FEE,
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
export const BITCOIN_TESTNET = {
    name: 'BITCOIN_TESTNET',
    type: 'testnet',
    bip: 1,
    segwit: true,
    discovery: process.env.BITCOIN_TESTNET_DISCOVERY,
    broadcastUrl: process.env.BITCOIN_TESTNET_BROADCAST,
    feeApi: process.env.BITCOIN_TESTNET_FEE,
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
export const LITECOIN = {
    name: 'LITECOIN',
    bip: 2,
    segwit: true,
    discovery: process.env.LITECOIN_DISCOVERY,
    broadcastUrl: process.env.LITECOIN_BROADCAST,
    feeApi: process.env.LITECOIN_FEE,
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
export const LITECOIN_TESTNET = {
    name: 'LITECOIN_TESTNET',
    type: 'litecoin testnet',
    bip: 1,
    segwit: true,
    discovery: process.env.LITECOIN_TESTNET_DISCOVERY,
    broadcastUrl: process.env.LITECOIN_TESTNET_BROADCAST,
    feeApi: process.env.LITECOIN_TESTNET_FEE,
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
export const DASH = {
    name: 'DASH',
    bip: 5,
    segwit: false,
    discovery: process.env.DASH_DISCOVERY,
    feeApi: process.env.DASH_FEE,
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
export const DASH_TESTNET = {
    name: 'DASH_TESTNET',
    bip: 1,
    segwit: false,
    discovery: process.env.DASH_TESTNET_DISCOVERY,
    feeApi: process.env.DASH_TESTNET_FEE,
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
export const DOGECOIN = {
    name: 'DOGECOIN',
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
export const DOGECOIN_TESTNET = {
    name: 'DOGECOIN_TESTNET',
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
export const VIACOIN = {
    name: 'VIACOIN',
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
export const VIACOIN_TESTNET = {
    name: 'VIACOIN_TESTNET',
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
export const ETHEREUM = {
    name: 'ETHEREUM',
    bip: 60,
    feeApi: process.env.ETHEREUM_FEE,
    provider: process.env.ETHEREUM_PROVIDER,
    chainId: 1,
};
export const ETHEREUM_ROPSTEN = {
    name: 'ETHEREUM_ROPSTEN',
    networkName: 'ropsten',
    bip: 60,
    getTranApi: process.env.ETHEREUM_ROPSTEN_GET_TRAN,
    getBalanceApi: process.env.ETHEREUM_ROPSTEN_GET_BALANCE,
    getErc20TranApi: process.env.ETHEREUM_ROPSTEN_GET_ERC20_TRAN,
    feeApi: process.env.ETHEREUM_ROPSTEN_FEE,
    provider: process.env.ETHEREUM_ROPSTEN_PROVIDER,
    chainId: 3,
};
export const ETHEREUM_RINKEBY = {
    name: 'ETHEREUM_RINKEBY',
    networkName: 'rinkeby',
    bip: 60,
    getTranApi: process.env.ETHEREUM_RINKEBY_GET_TRAN,
    getBalanceApi: process.env.ETHEREUM_RINKEBY_GET_BALANCE,
    getErc20TranApi: process.env.ETHEREUM_RINKEBY_GET_ERC20_TRAN,
    feeApi: process.env.ETHEREUM_RINKEBY_FEE,
    provider: process.env.ETHEREUM_RINKEBY_PROVIDER,
    chainId: 4,
};
export const ETHEREUM_KOVAN = {
    name: 'ETHEREUM_KOVAN',
    networkName: 'kovan',
    bip: 60,
    getTranApi: process.env.ETHEREUM_KOVAN_GET_TRAN,
    getBalanceApi: process.env.ETHEREUM_KOVAN_GET_BALANCE,
    getErc20TranApi: process.env.ETHEREUM_KOVAN_GET_ERC20_TRAN,
    feeApi: process.env.ETHEREUM_KOVAN_FEE,
    provider: process.env.ETHEREUM_KOVAN_PROVIDER,
    chainId: 42,
};
export const REGTEST = {
    name: 'REGTEST',
    type: 'test',
    bip: 0,
    discovery: process.env.BITCOIN_REGTEST_DISCOVERY,
    segwit: false,
    feeApi: process.env.BITCOIN_REGTEST_FEE,
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
