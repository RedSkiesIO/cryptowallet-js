export declare namespace CryptoWallet.SDKS {
    interface ISDK {
        generateHDWallet(entropy: string, network: string): Object;
        generateKeyPair(wallet: object, index: number, internal?: boolean): Object;
        importWIF(wif: string, network: string): Object;
        createRawTx(accounts: object[], change: string[], utxos: any, wallet: any, toAddress: string, amount: number, feeRate: number, max?: boolean): Object;
        broadcastTx(rawTx: object, network: string): Object;
        verifyTxSignature(transaction: object, network: string): boolean;
        accountDiscovery(entropy: string, netork: string, internal?: boolean): Object;
        getTransactionHistory(addresses: Array<String>, network: string, from: number, to: number): Object;
        getBalance(addresses: string[], network: string): Object;
        getPriceFeed(coins: string[], currencies: string[]): Object;
        getHistoricalData(coin: string, currency: string, period?: string): Object;
    }
}
