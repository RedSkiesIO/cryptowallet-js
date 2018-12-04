import * as IWIF from './IWIF'

export namespace CryptoWallet.SDKS {
  export interface ISDK {

    generateHDWallet(entropy: string, network: string): Object;

    generateKeyPair(wallet: object, index: number): Object;

    importWIF(wif: string): Object;

    gernerateP2SHMultiSig(keys: Array<string>): Object;

    createRawTx(keypair: any, toAmount: String, amount: number): Object;

    broadcastTx(rawTx: object, network: string): Object;

    create1t1tx(keypair: any, txHash: string, txNumber: number, address: string, amount: number): Object;

    create2t2tx(txparams: any): Object;

    verifyTxSignature(transaction: object): boolean;

    accountDiscovery(entropy: string, netork: string, internal?: boolean): Object;

    getWalletHistory(addresses: Array<String>, network: string, lastBlock: number, full?: boolean): Object;

    //getTransactionHistory(address: string, network: string, lastBlock: number, beforeBlock?: number, limit?: number): Object;

  }
}
