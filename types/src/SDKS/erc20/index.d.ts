/// <reference path="../../../../src/types/module.d.ts" />
import * as IERC20SDK from './IERC20SDK';
export declare namespace CryptoWallet.SDKS.ERC20 {
    class ERC20SDK implements IERC20SDK.CryptoWallet.SDKS.Erc20.IERC20SDK {
        json: any;
        networks: any;
        axios: any;
        Tx: any;
        Wallet: any;
        /**
         * Creates an object containg all the information relating to a ERC20 token
         *  and the account it's stored on
         * @param keypair
         * @param tokenName
         * @param tokenSymbol
         * @param contractAddress
         * @param decimals
         */
        generateERC20Wallet(keypair: any, tokenName: string, tokenSymbol: string, contractAddress: string, decimals: number): Object;
        /**
         * Only used internally to create a raw transaction
         * @param erc20Wallet
         * @param method
         */
        createTx(erc20Wallet: any, method: any, gasPrice: number, to?: string, amount?: number): Object;
        /**
        *  Broadcast an Ethereum transaction
        * @param rawTx
        * @param network
        */
        broadcastTx(rawTx: object, network: string): Object;
        /**
         * Create a transaction that transafers ERC20 tokens to a give address
         * @param erc20Wallet
         * @param to
         * @param amount
         */
        transfer(erc20Wallet: any, to: string, amount: number, gasPrice: number): Object;
        /**
         * Create a transaction that approves another account to transfer ERC20 tokens
         * @param erc20Wallet
         * @param to
         * @param amount
         */
        approveAccount(erc20Wallet: any, to: string, amount: number, gasPrice: number): Object;
        /**
         * Create a transaction that transfers money from another account
         * @param erc20Wallet
         * @param from
         * @param amount
         */
        transferAllowance(erc20Wallet: any, from: string, amount: number, gasPrice: number): Object;
        /**
         * Checks how much can be transfered from another account
         * @param erc20Wallet
         * @param from
         */
        checkAllowance(erc20Wallet: any, from: string): Object;
        /**
         * Gets the balance of the ERC20 token on a users ethereum account
         * @param erc20Wallet
         */
        getBalance(erc20Wallet: any): Object;
        /**
         * gets the transaction histroy of the ERC20 token on a users Ethereum account
         * @param erc20Wallet
         * @param lastBlock
         */
        getTransactionHistory(erc20Wallet: any, startBlock?: number): Object;
    }
}
declare const _default: typeof CryptoWallet.SDKS.ERC20.ERC20SDK;
export default _default;
