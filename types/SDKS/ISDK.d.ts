export declare namespace CryptoWallet.SDKS {
    interface ISDK {
        generateHDWallet(entropy: string, cointype: number): Object;
        generateKeyPair(wallet: object, index: number): Object;
        importWIF(wif: string): Object;
        gernerateP2SHMultiSig(keys: Array<string>): Object;
        create1t1tx(keypair: any, txHash: string, txNumber: number, address: string, amount: number): Object;
        create2t2tx(txparams: any): Object;
        verifyTxSignature(transaction: object): boolean;
    }
}