export namespace CryptoWallet.SDKS.Erc20 {
  export interface IERC20SDK {

    generateERC20Wallet(
      ethAccount: any,
      tokenName: string,
      tokenSymbol: string,
      contractAddress: string,
      decimals: number): Object;

    transferERC20(erc20Wallet: any, to: string, amount: number, gasPrice: number): Object;

    approveAccountERC20(erc20Wallet: any, to: string, amount: number, gasPrice: number): Object;

    transferAllowanceERC20(
      erc20Wallet: any, from: string, amount: number, gasPrice: number): Object;

    checkAllowanceERC20(erc20Wallet: any, from: string, amount: number): Object;

    getERC20Balance(erc20Wallet: any): Object;

    getERC20TransactionHistory(erc20Wallet: any, lastBlock?: number): Object;
  }
}
