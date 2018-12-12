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
        importWIF(wif: string): Object;
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
        getTransactionHistory(address: string, addresses: string[], network: string, lastBlock: number, beforeBlock?: number, limit?: number): Object;
        getWalletHistory(addresses: string[], network: string, lastBlock: number, full?: boolean): Object;
        accountDiscovery(entropy: string, network: string, internal?: boolean): Object;
    }
}
declare const _default: typeof CryptoWallet.SDKS.Ethereum.EthereumSDK;
export default _default;
