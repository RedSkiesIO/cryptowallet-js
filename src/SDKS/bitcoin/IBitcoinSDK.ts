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
import { Wallet, KeyPair } from '../GenericSDK.d';

export namespace CryptoWallet.SDKS.Bitcoin {
  export interface IBitcoinSDK {
    generateSegWitAddress(
      keypair: KeyPair,
    ): string;

    generateSegWitP2SH(
      keypair: KeyPair,
    ): string;

    generateSegWit3of4MultiSigAddress(
      key1: string,
      key2: string,
      key3: string,
      key4: string,
      network: string,
    ): string;

    create1t1tx(
      keypair: KeyPair,
      txHash: string,
      txNumber: number,
      txValue: number,
      address: string,
      amount: number,
    ): String;

    create2t2tx(
      keypair1: KeyPair,
      keypair2: KeyPair,
      utxo1: any,
      utxo2: any,
      output1: any,
      output2: any,
    ): String;

    generateP2SHMultiSig(
      keys: string[],
      network: string,
    ): Object;

    getUTXOs(
      addresses: string[],
      network: string,
    ): Object;

    createTxToMany(
      accounts: object[],
      change: string[],
      utxos: any,
      wallet: Wallet,
      toAddresses: string[],
      amounts: number[],
      minerRate: number,
    ): Object;
  }
}
