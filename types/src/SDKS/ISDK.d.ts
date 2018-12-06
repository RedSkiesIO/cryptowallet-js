export declare namespace CryptoWallet.SDKS {
    interface ISDK {
        generateHDWallet(entropy: string, network: string): Object;
        generateKeyPair(wallet: object, index: number, internal?: boolean): Object;
        importWIF(wif: string): Object;
        gernerateP2SHMultiSig(keys: Array<string>): Object;
        createRawTx(accounts: object[], change: string, utxos: any, entropy: string, network: string, toAddress: string, amount: number): Object;
        broadcastTx(rawTx: object, network: string): Object;
        create1t1tx(keypair: any, txHash: string, txNumber: number, address: string, amount: number): Object;
        create2t2tx(txparams: any): Object;
        verifyTxSignature(transaction: object): boolean;
        accountDiscovery(entropy: string, netork: string, internal?: boolean): Object;
        getWalletHistory(addresses: Array<String>, network: string, lastBlock: number, full?: boolean): Object;
        getUTXOs(addresses: Array<String>, network: string): Object;
    }
}
