import * as Bitcoinlib from 'bitcoinjs-lib';
import { KeyPair, Wallet, Address } from 'GenericSDK';
import * as ISDK from './ISDK';
export declare namespace CryptoWallet.SDKS {
    abstract class GenericSDK implements ISDK.CryptoWallet.SDKS.ISDK {
        bitcoinlib: typeof Bitcoinlib;
        networks: any;
        bip39: any;
        wif: any;
        request: any;
        axios: any;
        /**
         * generates an hierarchical determinitsic wallet for a given coin type
         * @param entropy
         * @param network
         */
        generateHDWallet(entropy: string, network: string): Wallet;
        /**
        * This method creates a keypair from a wallet object and a given index
        * @param wallet
        * @param index
        * @param internal
        */
        generateKeyPair(wallet: Wallet, index: number, internal?: boolean): KeyPair;
        /**
        * This method generates an address from a wallet object and a given index.
        * @param wallet
        * @param index
        * @param external
        */
        generateAddress(wallet: Wallet, index: number, internal?: boolean): Address;
        /**
         *  Restore  a keypair using a WIF
         * @param wif
         * @param network
         */
        importWIF(wif: string, network: string): Object;
        /**
         * broadcasts a transaction
         * @param tx
         * @param network
         */
        broadcastTx(tx: string, network: string): Object;
        /**
         * validates an address
         * @param address
         * @param network
         */
        validateAddress(address: string, network: string): boolean;
        /**
         * gets the estimated cost of a transaction
         * TODO: only works for bitcoin currently
         * @param network
         */
        getTransactionFee(network: string): Object;
        /**
        * returns a transaction object that contains the raw transaction hex
        * @param keypair
        * @param toAddress
        * @param amount
        */
        createRawTx(accounts: object[], change: string[], utxos: any, wallet: Wallet, toAddress: string, amount: number, minerRate: number, max?: boolean): Promise<Object>;
        /**
        * verifies the signatures of a transaction object
        * @param transaction
        */
        verifyTxSignature(transaction: any, network: string): boolean;
        /**
         * This method discovers the addresses which have previously been used in a wallet
         * @param entropy
         * @param network
         * @param internal
         */
        accountDiscovery(wallet: Wallet, network: string, internal?: boolean): Object;
        /**
         * gets the transaction history for an array of addresses
         * @param addresses
         * @param network
         * @param from
         * @param to
         */
        getTransactionHistory(addresses: string[], network: string, from: number, to: number): Object;
        /**
         * gets the total balance of an array of addresses
         * @param addresses
         * @param network
         */
        getBalance(addresses: string[], network: string): Object;
        getPriceFeed(coins: string[], currencies: string[]): Object;
        getHistoricalData(coin: string, currency: string, period: string): Object;
    }
}
declare const _default: typeof CryptoWallet.SDKS.GenericSDK;
export default _default;
