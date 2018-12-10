import * as IERC20SDK from './IERC20SDK';
export declare namespace CryptoWallet.SDKS.ERC20 {
    class ERC20SDK implements IERC20SDK.CryptoWallet.SDKS.Erc20.IERC20SDK {
        generateERC20Wallet(ethAccount: any, tokenName: string, tokenSymbol: string, contractAddress: string, decimals: number): Object;
        transferERC20(erc20Wallet: any, to: string, amount: number): Object;
        approveAccountERC20(erc20Wallet: any, to: string, amount: number): Object;
        transferAllowanceERC20(erc20Wallet: any, from: string, amount: number): Object;
        checkAllowanceERC20(erc20Wallet: any, from: string, amount: number): Object;
        getERC20Balance(erc20Wallet: any): Object;
    }
}
