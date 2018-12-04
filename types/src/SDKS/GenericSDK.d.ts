/// <reference path="../../module.d.ts" />
import * as ISDK from './ISDK';
import * as Bitcoinlib from 'bitcoinjs-lib';
export declare namespace CryptoWallet.SDKS {
    abstract class GenericSDK implements ISDK.CryptoWallet.SDKS.ISDK {
        bitcoinlib: typeof Bitcoinlib;
        networks: any;
        bip39: any;
        wif: any;
        request: any;
        axios: any;
        generateHDWallet(entropy: string, network: string): Object;
        generateKeyPair(wallet: any, index: number): Object;
        abstract broadcastTx(rawTx: object, network: string): Object;
        abstract importWIF(wif: string): Object;
        abstract gernerateP2SHMultiSig(keys: Array<string>): Object;
        abstract createRawTx(keypair: any, toAddress: String, amount: number): Object;
        abstract verifyTxSignature(transaction: object): boolean;
        abstract create1t1tx(keypair: any, txHash: string, txNumber: number, address: string, amount: number): String;
        abstract create2t2tx(txparams: any): String;
        abstract accountDiscovery(entropy: string, netork: string): Object;
        getWalletHistory(addresses: Array<String>, network: string, lastBlock: number, full?: boolean): Object;
        getTransactionHistory(address: string, addresses: Array<String>, network: string, lastBlock: number, beforeBlock?: number, limit?: number): Object;
    }
}
declare const _default: typeof CryptoWallet.SDKS.GenericSDK;
export default _default;
