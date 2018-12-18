/// <reference path="../../module.d.ts" />
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
        /**
        *
        * @param wallet
        * @param index
        * @param external
        */
        generateKeyPair(wallet: any, index: number, internal?: boolean): Object;
        /**
         *
         * @param wif
         * @param network
         */
        importWIF(wif: string, network: string): Object;
        broadcastTx(tx: object, network: string): Object;
        validateAddress(address: string, wallet: any): boolean;
        getTransactionFee(network: string): Object;
        /**
     *
     * @param keypair
     * @param toAddress
     * @param amount
     */
        createRawTx(accounts: object[], change: string[], utxos: any, wallet: any, toAddress: string, amount: number, minerRate: number): Object;
        /**
        *
        * @param transaction
        */
        verifyTxSignature(transaction: any, network: string): boolean;
        accountDiscovery(entropy: string, network: string, internal?: boolean): Object;
        getTransactionHistory(addresses: string[], network: string, from: number, to: number): Object;
        getBalance(addresses: string[], network: string): Object;
    }
}
declare const _default: typeof CryptoWallet.SDKS.GenericSDK;
export default _default;
