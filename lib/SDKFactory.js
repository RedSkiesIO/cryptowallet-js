/* eslint-disable import/no-unresolved */
/* eslint-disable no-inner-declarations */
import BitcoinSDK from './SDKS/bitcoin';
import EthereumSDK from './SDKS/ethereum';
import ERC20SDK from './SDKS/erc20';
export var CryptoWallet;
(function (CryptoWallet) {
    function createSDK(sdk) {
        switch (sdk) {
            case 'Bitcoin':
                return new BitcoinSDK();
            case 'Ethereum':
                return new EthereumSDK();
            case 'ERC20':
                return new ERC20SDK();
            default:
                return new BitcoinSDK();
        }
    }
    CryptoWallet.createSDK = createSDK;
})(CryptoWallet || (CryptoWallet = {}));
