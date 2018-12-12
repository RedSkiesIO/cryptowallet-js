import * as Bitcoinlib from 'bitcoinjs-lib';
import * as ISDK from './ISDK';
export declare namespace CryptoWallet.SDKS {
    abstract class GenericSDK implements ISDK.CryptoWallet.SDKS.ISDK {
        bitcoinlib: typeof Bitcoinlib;
        networks: any;
        bip39: any;
        wif: any;
        request: any;
        axios: any;
        generateHDWallet(entropy: string, network: string): Object;
        generateKeyPair(wallet: any, index: number, external?: boolean): Object;
        abstract broadcastTx(rawTx: object, network: string): Object;
        abstract importWIF(wif: string): Object;
        abstract verifyTxSignature(transaction: object): boolean;
        abstract accountDiscovery(entropy: string, netork: string): Object;
        getWalletHistory(addresses: string[], network: string, lastBlock: number, full?: boolean): Object;
        getTransactionHistory(address: string, addresses: string[], network: string, lastBlock: number, beforeBlock?: number, limit?: number): Object;
    }
}
declare const _default: typeof CryptoWallet.SDKS.GenericSDK;
export default _default;
