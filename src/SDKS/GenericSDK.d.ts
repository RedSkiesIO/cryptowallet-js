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

export type Wallet = {
  ext: any;
  int: any;
  bip: number;
  type: number;
  network: any;
};

export type KeyPair = {
  publicKey: string;
  address: string;
  derivationPath: string;
  privateKey: string;
  type: string;
  network: any;
  change?: boolean;
};

export type Address = {
  address: string;
  index: number;
  type: string;
  change?: boolean;
};

export type Transaction = {
  fee: number;
  change: string[];
  receiver: string[];
  confirmed: boolean;
  inputs: string[];
  confirmations: number;
  hash: string;
  blockHeight: number;
  sent: boolean;
  value: number;
  sender: string[];
  receivedTime: number;
  confirmedTime: any;
};
