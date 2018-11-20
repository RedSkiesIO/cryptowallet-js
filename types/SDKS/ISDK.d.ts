export declare namespace CryptoWallet.SDKS {
    interface ISDK {
        generateKeyPair(entropy: string, cointype: number): Object;
        importWIF(wif: string): Object;
        gernerateP2SHMultiSig(keys: Array<string>): Object;
        create1t1tx(): Object;
        create2t2tx(): Object;
        verifyTxSignature(transaction: object): boolean;
    }
}
