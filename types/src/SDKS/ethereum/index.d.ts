/// <reference path="../../../../src/types/module.d.ts" />
import GenericSDK from '../GenericSDK';
import * as IEthereumSDK from './IEthereumSDK';
export declare namespace CryptoWallet.SDKS.Ethereum {
    class EthereumSDK extends GenericSDK implements IEthereumSDK.CryptyoWallet.SDKS.Ethereum.IEthereumSDK {
        Bip: any;
        ethereumlib: any;
        Web3: any;
        VerifyTx: any;
        /**
         *
         * @param wallet
         * @param index
         */
        generateKeyPair(wallet: any, index: number): Object;
        /**
         *
         * @param wif
         */
        importWIF(wif: string, network: string): Object;
        /**
         *
         * @param keypair
         * @param toAddress
         * @param amount
         */
        createEthTx(keypair: any, toAddress: String, amount: number): Object;
        /**
         *
         * @param rawTx
         * @param network
         */
        broadcastTx(rawTx: object, network: string): Object;
        /**
         *
         * @param tx
         */
        verifyTxSignature(tx: any): boolean;
        getTransactionHistory(addresses: string[], network: string, startBlock: number, endBlock?: number): Object;
        getBalance(addresses: string[], network: string): Object;
        accountDiscovery(entropy: string, network: string, internal?: boolean): Object;
    }
}
declare const _default: typeof CryptoWallet.SDKS.Ethereum.EthereumSDK;
export default _default;
