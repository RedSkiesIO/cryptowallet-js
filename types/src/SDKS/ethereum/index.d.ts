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
         * generate an ethereum keypair using a HD wallet object
         * @param wallet
         * @param index
         */
        generateKeyPair(wallet: any, index: number): Object;
        /**
        * generates an etherum address using a HD wallet object
        * @param wallet
        * @param index
        */
        generateAddress(wallet: any, index: number): Object;
        /**
         * A method that checks if an address is a valid Ethereum address
         * @param address
         * @param network
         */
        validateAddress(address: string, network: string): boolean;
        /**
         * Restore an ethereum keypair using a private key
         * @param wif
         * @param network
         */
        importWIF(wif: string, network: string): Object;
        /**
         *  Create an Ethereum raw transaction
         * @param keypair
         * @param toAddress
         * @param amount
         */
        createEthTx(keypair: any, toAddress: String, amount: number, gasPrice: number): Object;
        /**
         *  Broadcast an Ethereum transaction
         * @param rawTx
         * @param network
         */
        broadcastTx(rawTx: object, network: string): Object;
        /**
         *  Verify the signature of an Ethereum transaction object
         * @param tx
         */
        verifyTxSignature(tx: any): boolean;
        /**
         * Gets the transaction history for an array of addresses
         * @param addresses
         * @param network
         * @param startBlock
         * @param endBlock
         */
        getTransactionHistory(addresses: string[], network: string, startBlock: number, endBlock?: number): Object;
        /**
         * Gets the total balance of an array of addresses
         * @param addresses
         * @param network
         */
        getBalance(addresses: string[], network: string): Object;
        /**
         * Generates the first 10 accounts of an ethereum wallet
         * @param entropy
         * @param network
         * @param internal
         */
        accountDiscovery(entropy: string, network: string, internal?: boolean): Object;
    }
}
declare const _default: typeof CryptoWallet.SDKS.Ethereum.EthereumSDK;
export default _default;
