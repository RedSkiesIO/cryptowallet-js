import * as ISDK from './ISDK';
export declare namespace CryptoWallet.SDKS {
    abstract class GenericSDK implements ISDK.CryptoWallet.SDKS.ISDK {
        generateHDWallet(entropy: string, cointype: number): Object;
        abstract generateKeyPair(wallet: any, index: number): Object;
        abstract importWIF(wif: string): Object;
        abstract gernerateP2SHMultiSig(keys: Array<string>): Object;
        abstract createTX(options: Object): Object;
        abstract verifyTxSignature(transaction: object): boolean;
        abstract create1t1tx(keypair: any, txHash: string, txNumber: number, address: string, amount: number): String;
        abstract create2t2tx(txparams: any): String;
    }
}
declare const _default: typeof CryptoWallet.SDKS.GenericSDK;
export default _default;
