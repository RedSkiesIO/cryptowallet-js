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
import Bitcoin from './SDKS/bitcoin';
import Ethereum from './SDKS/ethereum';
import Catalyst from './SDKS/catalyst';
import ERC20 from './SDKS/erc20';
var CryptoWallet;
(function (CryptoWallet) {
    CryptoWallet.createSDK = function SDKFactory(sdk, api) {
        switch (sdk) {
            case 'Bitcoin':
                return new Bitcoin(api);
            case 'Ethereum':
                return new Ethereum(api);
<<<<<<< HEAD
            case 'Catalyst':
                return new Catalyst(api);
=======
>>>>>>> develop
            case 'ERC20':
                return new ERC20(api);
            default:
                return new Bitcoin(api);
        }
    };
})(CryptoWallet || (CryptoWallet = {}));
export default CryptoWallet;
