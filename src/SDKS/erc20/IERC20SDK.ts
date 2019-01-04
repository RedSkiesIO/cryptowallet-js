export namespace CryptoWallet.SDKS.Erc20 {
  export interface IERC20SDK {

    generateERC20Wallet(
      ethAccount: any,
      tokenName: string,
      tokenSymbol: string,
      contractAddress: string,
      decimals: number): Object;

    transfer(erc20Wallet: any, to: string, amount: number, gasPrice: number): Object;

    approveAccount(erc20Wallet: any, to: string, amount: number, gasPrice: number): Object;

    transferAllowance(
      erc20Wallet: any, from: string, amount: number, gasPrice: number): Object;

    checkAllowance(erc20Wallet: any, from: string, amount: number): Object;

    getBalance(erc20Wallet: any): Object;

    getTransactionHistory(erc20Wallet: any, lastBlock?: number): Object;
  }
}
