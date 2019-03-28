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
import 'jest';
import CryptoWallet from './SDKFactory';

const entropy = 'inner shiver hold grow quit talk swap extend mutual praise champion canyon';

const btc: any = CryptoWallet.createSDK('default');
const wallet: any = btc.generateHDWallet(entropy, 'BITCOIN_TESTNET');


describe('getTransactionHistory', () => {
  it('can discover an account discovery', async () => {
    const discovery = await btc.accountDiscovery(wallet, true);
    console.log('discovery :', discovery);
  });
});
