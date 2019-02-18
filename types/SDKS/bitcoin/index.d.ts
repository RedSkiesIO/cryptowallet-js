/// <reference path="../../../src/types/module.d.ts" />
import * as BitcoinLib from 'bitcoinjs-lib';
import * as Request from 'request';
import { KeyPair, Wallet } from '../GenericSDK.d';
import * as IBitcoinSDK from './IBitcoinSDK';
import GenericSDK from '../GenericSDK.ts';
export declare namespace CryptoWallet.SDKS.Bitcoin {
    class BitcoinSDK extends GenericSDK implements IBitcoinSDK.CryptoWallet.SDKS.Bitcoin.IBitcoinSDK {
        Explore: any;
        Req: Request.RequestAPI<Request.Request, Request.CoreOptions, Request.RequiredUriUrl>;
        /**
         * generates a segwit address
         * @param keyPair
         */
        generateSegWitAddress(keyPair: KeyPair): string;
        /**
         * generates a segwit P2SH address
         * @param keyPair
         */
        generateSegWitP2SH(keyPair: KeyPair): string;
        /**
         * generates a 3 0f 4 multisig segwit address
         * @param key1
         * @param key2
         * @param key3
         * @param key4
         * @param network
         */
        generateSegWit3of4MultiSigAddress(key1: string, key2: string, key3: string, key4: string, network: string): string;
        /**
         *  generates a P2SH multisig keypair
         * @param keys
         * @param network
         */
        gernerateP2SHMultiSig(keys: string[], network: string): string;
        /**
         *  gets the unspent transactions for an array of addresses
         * @param addresses
         * @param network
         */
        getUTXOs(addresses: string[], network: string): Object;
        /**
         * creates a transaction with multiple receivers
         * @param accounts
         * @param change
         * @param utxos
         * @param wallet
         * @param toAddresses
         * @param amounts
         * @param minerRate
         */
        createTxToMany(accounts: object[], change: string[], utxos: any, wallet: Wallet, toAddresses: string[], amounts: number[], minerRate: number): Object;
        /**
         *
         * @param keypair
         * @param txHash
         * @param txNumber
         * @param address
         * @param amount
         */
        create1t1tx(keypair: BitcoinLib.ECPair, txHash: string, txNumber: number, address: string, amount: number): String;
        /**
         *
         * @param txparams
         */
        create2t2tx(txparams: any): String;
    }
}
declare const _default: typeof CryptoWallet.SDKS.Bitcoin.BitcoinSDK;
export default _default;
