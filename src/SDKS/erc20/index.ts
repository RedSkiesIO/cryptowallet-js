
import * as IERC20SDK from './IERC20SDK'

export namespace CryptoWallet.SDKS.ERC20 {
    export class ERC20SDK implements IERC20SDK.CryptoWallet.SDKS.Erc20.IERC20SDK {

        generateERC20Wallet(ethAccount: any, tokenName: string, tokenSymbol: string, contractAddress: string, decimals: number): Object {

            return {
                address: ethAccount.address,
                index: ethAccount.index,
                wallet: ethAccount.wallet,
                symbol: tokenSymbol,
                contract: contractAddress,
                decimals: decimals

            }

        }
        transferERC20(erc20Wallet: any, to: string, amount: number): Object {
            throw new Error("Method not implemented.");
        }
        approveAccountERC20(erc20Wallet: any, to: string, amount: number): Object {
            throw new Error("Method not implemented.");
        }
        transferAllowanceERC20(erc20Wallet: any, from: string, amount: number): Object {
            throw new Error("Method not implemented.");
        }
        checkAllowanceERC20(erc20Wallet: any, from: string, amount: number): Object {
            throw new Error("Method not implemented.");
        }
        getERC20Balance(erc20Wallet: any): Object {
            //var tokenContract = eth.contract(tokenABI).at(erc20Wallet.contract);
            //var tokenBalance = tokenContract.balanceOf(erc20Wallet.address);
            throw new Error("Method not implemented.");
        }


    }
}