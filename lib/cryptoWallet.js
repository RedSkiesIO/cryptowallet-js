// eslint-disable-next-line import/no-unresolved
import * as SDKFactory from './SDKFactory';
var CryptoWallet;
(function (CryptoWallet) {
    class CryptoWalletJS {
        constructor() {
            this.SDKFactory = SDKFactory;
        }
    }
    CryptoWallet.CryptoWalletJS = CryptoWalletJS;
})(CryptoWallet || (CryptoWallet = {}));
export default CryptoWallet.CryptoWalletJS;
