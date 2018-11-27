export declare namespace CryptoWallet.SDKS {
    interface ISDK {
        generateHDWallet(entropy: string, network: string): Object;
        generateKeyPair(wallet: object, index: number): Object;
        importWIF(wif: string): Object;
        gernerateP2SHMultiSig(keys: Array<string>): Object;
        createRawTx(keypair: any, toAmount: String, amount: number): Object;
        create1t1tx(keypair: any, txHash: string, txNumber: number, address: string, amount: number): Object;
        create2t2tx(txparams: any): Object;
        verifyTxSignature(transaction: object): boolean;
    }
}
