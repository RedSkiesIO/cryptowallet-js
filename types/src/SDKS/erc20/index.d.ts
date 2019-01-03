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
        createTx(erc20Wallet: any, method: any, gasPrice: number): Object;
        /**
         * Create a transaction that transafers ERC20 tokens to a give address
         * @param erc20Wallet
         * @param to
         * @param amount
         */
        transferERC20(erc20Wallet: any, to: string, amount: number, gasPrice: number): Object;
        /**
         * Create a transaction that approves another account to transafer ERC20 tokens
         * @param erc20Wallet
         * @param to
         * @param amount
         */
        approveAccountERC20(erc20Wallet: any, to: string, amount: number, gasPrice: number): Object;
        /**
         * Create a transaction that transfers money from another account
         * @param erc20Wallet
         * @param from
         * @param amount
         */
        transferAllowanceERC20(erc20Wallet: any, from: string, amount: number, gasPrice: number): Object;
        /**
         * Checks how much can be transfered from another account
         * @param erc20Wallet
         * @param from
         */
        checkAllowanceERC20(erc20Wallet: any, from: string): Object;
        /**
         * Gets the balance of the ERC20 token on a users ethereum account
         * @param erc20Wallet
         */
        getERC20Balance(erc20Wallet: any): Object;
        /**
         * gets the transaction histroy of the ERC20 token on a users Ethereum account
         * @param erc20Wallet
         * @param lastBlock
         */
        getERC20TransactionHistory(erc20Wallet: any, lastBlock?: number): Object;
    }
}
declare const _default: typeof CryptoWallet.SDKS.ERC20.ERC20SDK;
export default _default;
