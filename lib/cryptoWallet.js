import * as SDKFactory from './SDKFactory.ts';
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
