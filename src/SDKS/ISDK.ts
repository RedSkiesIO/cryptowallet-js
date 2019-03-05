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
import { Wallet, KeyPair, Address } from './GenericSDK.d';

export namespace CryptoWallet.SDKS {
  export interface ISDK {
    generateHDWallet(
      entropy: string,
      network: string,
    ): Wallet;

    generateKeyPair(
      wallet: object,
      index: number,
      internal?: boolean,
    ): KeyPair;

    generateAddress(
      wallet: Wallet,
      index: number,
      internal?: boolean,
    ): Address;

    importWIF(
      wif: string,
      network: string,
    ): Object;

    createRawTx(
      accounts: object[],
      change: string[],
      utxos: any,
      wallet: Wallet,
      toAddress: string,
      amount: number,
      feeRate: number,
      max?: boolean,
    ): Object;

    broadcastTx(
      rawTx: string,
      network: string,
    ): Object;

    validateAddress(
      address: string,
      network: string,
    ): boolean;

    getTransactionFee(
      network: string,
    ): Object;

    verifyTxSignature(
      transaction: object,
      network: string,
    ): boolean;

    accountDiscovery(
      wallet: Wallet,
      internal?: boolean,
    ): Object;

    getTransactionHistory(
      addresses: string[],
      network: string,
      from: number,
      to: number,
    ): Object;

    getBalance(
      addresses: string[],
      network: string,
    ): Object;
  }
}
