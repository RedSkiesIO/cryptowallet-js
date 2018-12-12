/// <reference path="../../../../src/types/module.d.ts" />
import * as IBitcoinSDK from './IBitcoinSDK';
import GenericSDK from '../GenericSDK';
declare namespace CryptoWallet.SDKS.Bitcoin {
    class BitcoinSDK extends GenericSDK implements IBitcoinSDK.CryptyoWallet.SDKS.Bitcoin.IBitcoinSDK {
        Explore: any;
        Req: any;
        /**
        *
        * @param wallet
        * @param index
        * @param external
        */
        generateKeyPair(wallet: any, index: number, internal?: boolean): Object;
        /**
         *
         * @param keyPair
         */
        generateSegWitAddress(keyPair: any): Object;
        /**
         *
         * @param keyPair
         */
        generateSegWitP2SH(keyPair: any): Object;
        /**
         *
         * @param key1
         * @param key2
         * @param key3
         * @param key4
         */
        /**
         *
         * @param wif
         */
        importWIF(wif: string): Object;
        /**
         *
         * @param keys
         */
        gernerateP2SHMultiSig(keys: string[]): Object;
        getUTXOs(addresses: string[], network: string): Object;
        /**
         *
         * @param keypair
         * @param toAddress
         * @param amount
         */
        createRawTx(accounts: object[], change: string[], utxos: any, wallet: any, toAddress: string, amount: number): Object;
        broadcastTx(rawTx: object, network: string): Object;
        decodeTx(rawTx: Object, change: string[], amount: number, receiver: string, wallet: any): Object;
        /**
         *
         * @param transaction
         */
        verifyTxSignature(transaction: any): boolean;
        /**
         *
         */
        create1t1tx(keypair: any, txHash: string, txNumber: number, address: string, amount: number): String;
        /**
         *
         */
        create2t2tx(txparams: any): String;
        accountDiscovery(entropy: string, network: string, internal?: boolean): Object;
    }
}
declare const _default: typeof CryptoWallet.SDKS.Bitcoin.BitcoinSDK;
export default _default;
