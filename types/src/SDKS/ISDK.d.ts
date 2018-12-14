export declare namespace CryptoWallet.SDKS {
    interface ISDK {
        generateHDWallet(entropy: string, network: string): Object;
        generateKeyPair(wallet: object, index: number, internal?: boolean): Object;
        importWIF(wif: string, network: string): Object;
        broadcastTx(rawTx: object, network: string): Object;
        verifyTxSignature(transaction: object): boolean;
        accountDiscovery(entropy: string, netork: string, internal?: boolean): Object;
        getTransactionHistory(addresses: Array<String>, network: string, from: number, to: number): Object;
        getBalance(addresses: string[], network: string): Object;
    }
}
