/**
* Copyright (c) 2019 https://atlascity.io
*
* This file is part of CryptoWallet-js <https://github.com/atlascity/cryptowallet-js>
*
* CryptoWallet-js is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 2 of the License, or
* (at your option) any later version.
*
* CryptoWallet-js is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with CryptoWallet-js. If not, see <https://www.gnu.org/licenses/>.
*/
export namespace CryptoWallet.SDKS.Erc20 {
  export interface IERC20SDK {

    generateERC20Wallet(
      ethAccount: any,
      tokenName: string,
      tokenSymbol: string,
      contractAddress: string,
      decimals: number
    ): Object;

    transfer(
      erc20Wallet: any,
      keypair: any,
      to: string,
      amount: number,
      gasPrice: number
    ): Object;

    approveAccount(
      erc20Wallet: any,
      keypair: any,
      to: string,
      amount: number,
      gasPrice: number
    ): Object;

    transferAllowance(
      erc20Wallet: any,
      keypair: any,
      from: string,
      amount: number,
      gasPrice: number
    ): Object;

    checkAllowance(
      erc20Wallet: any,
      from: string,
      amount: number
    ): Object;

    getBalance(
      erc20Wallet: any
    ): Object;

    getTransactionHistory(
      erc20Wallet: any,
      lastBlock?: number
    ): Object;
  }
}
