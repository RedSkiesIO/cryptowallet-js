export declare namespace CryptoWallet.SDKS {
    interface ISDK {
        generateHDWallet(entropy: string, network: string): Object;
        generateKeyPair(wallet: object, index: number, internal?: boolean): Object;
        importWIF(wif: string): Object;
        broadcastTx(rawTx: object, network: string): Object;
        verifyTxSignature(transaction: object): boolean;
        accountDiscovery(entropy: string, netork: string, internal?: boolean): Object;
        getTransactionHistory(address: string, addresses: Array<String>, network: string, lastBlock: number, beforeBlock?: number, limit?: number): Object;
        getWalletHistory(addresses: Array<String>, network: string, lastBlock: number, full?: boolean): Object;
    }
}
