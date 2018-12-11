export const token = 'token=f4d997113b76452393a65216e046ab77'
export const ethToken = '2JAADVNZG512YIZSCF7S6JDXS8QI7PSUFY'

export const BITCOIN = {
  name: 'Bitcoin',
  bip: 0,
  connect: {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bip32: {
      private: 0x0488ade4,
      public: 0x0488b21e
    },
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0x80
  }
}


export const LITECOIN = {
  name: 'Litecoin',
  bip: 2,
  connect: {
    messagePrefix: '\x19Litecoin Signed Message:\n',
    bip32: {
      public: 0x019da462,
      private: 0x019d9cfe
    },
    pubKeyHash: 0x30,
    scriptHash: 0x32,
    wif: 0xb0
  }
}

export const LITECOIN_TESTNET = {
  name: 'Litecoin Testnet',
  bip: 1,
  connect: {
    messagePrefix: '\x19Litecoin Signed Message:\n',
    bip32: {
      private: 0x0436ef7d,
      public: 0x0436f6e1
    },
    pubKeyHash: 0x6f,
    scriptHash: 0x3a,
    wif: 0xef
  }
}

export const DOGECOIN = {
  name: 'Dogecoin',
  bip: 3,
  connect: {
    messagePrefix: '\x18Dogecoin Signed Message:\n',
    bip32: {
      private: 0x02fac398,
      public: 0x02facafd
    },
    wif: 0x9e,
    public: 0x1e,
    scripthash: 0x16
  }
}

export const DOGECOIN_TESTNET = {
  name: 'Dogecoin Testnet',
  bip: 1,
  connect: {
    messagePrefix: '\x18Dogecoin Signed Message:\n',
    bip32: {
      private: 0x0432a243,
      public: 0x0432a9a8
    },
    wif: 0xf1,
    public: 0x71,
    scripthash: 0xc4
  }
}

export const ETHEREUM = {
  name: 'Ethereum',
  bip: 60,
  sendTxApi: 'https://api.blockcypher.com/v1/eth/main/txs/push'
}

export const ETHEREUM_ROPSTEN = {
  name: 'Ethereum Ropsten',
  networkName: 'ropsten',
  bip: 60,
  sendTxApi: 'https://api.blockcypher.com/v1/eth/main/txs/push',
  getTranApi: 'http://api-ropsten.etherscan.io/api?module=account&action=txlist&address=',
  provider: 'https://ropsten.infura.io/v3/352fc30cd8364caabaea4a3d67da773f',
  chainId: 3
}

export const BITCOIN_TESTNET = {
  name: 'Bitcoin Testnet',
  bip: 1,
  apiUrl: 'https://chain.so/api/v2/get_tx_unspent/BTCTEST/',
  sendTxApi: 'https://api.blockcypher.com/v1/btc/test3/txs/push',
  getTranApi: 'https://api.blockcypher.com/v1/btc/test3/addrs/',
  decodeTxApi: 'https://api.blockcypher.com/v1/btc/test3/txs/decode',
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
