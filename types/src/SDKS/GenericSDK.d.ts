/// <reference path="../../module.d.ts" />
import * as ISDK from './ISDK';
import * as Bitcoinlib from 'bitcoinjs-lib';
export declare namespace CryptoWallet.SDKS {
    abstract class GenericSDK implements ISDK.CryptoWallet.SDKS.ISDK {
        createEthTx(keypair: any, toAddress: String, amount: number): Object;
        abstract getUTXOs(addresses: String[], network: string): Object;
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
        abstract createRawTx(accounts: object[], change: string, utxos: any, network: string, toAddress: string, amount: number): Object;
        abstract verifyTxSignature(transaction: object): boolean;
        abstract accountDiscovery(entropy: string, netork: string): Object;
        getWalletHistory(addresses: Array<String>, network: string, lastBlock: number, full?: boolean): Object;
        getTransactionHistory(address: string, addresses: Array<String>, network: string, lastBlock: number, beforeBlock?: number, limit?: number): Object;
    }
}
declare const _default: typeof CryptoWallet.SDKS.GenericSDK;
export default _default;
