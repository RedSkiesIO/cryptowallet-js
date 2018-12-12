import * as IERC20SDK from './IERC20SDK';
export declare namespace CryptoWallet.SDKS.ERC20 {
    class ERC20SDK implements IERC20SDK.CryptoWallet.SDKS.Erc20.IERC20SDK {
        json: any;
        networks: any;
        axios: any;
        Tx: any;
        Wallet: any;
        generateERC20Wallet(keypair: any, tokenName: string, tokenSymbol: string, contractAddress: string, decimals: number): Object;
        createTx(erc20Wallet: any, method: any): Promise<{}>;
        transferERC20(erc20Wallet: any, to: string, amount: number): Object;
        approveAccountERC20(erc20Wallet: any, to: string, amount: number): Object;
        transferAllowanceERC20(erc20Wallet: any, from: string, amount: number): Object;
        checkAllowanceERC20(erc20Wallet: any, from: string): Object;
        getERC20Balance(erc20Wallet: any): Object;
        getERC20TransactionHistory(erc20Wallet: any, lastBlock?: number): Object;
    }
}
declare const _default: typeof CryptoWallet.SDKS.ERC20.ERC20SDK;
export default _default;
