"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SDKFactory = require("./SDKFactory.ts");
var CryptoWallet;
(function (CryptoWallet) {
    class CryptoWalletJS {
        constructor() {
            this.SDKFactory = SDKFactory;
        }
    }
    CryptoWallet.CryptoWalletJS = CryptoWalletJS;
})(CryptoWallet || (CryptoWallet = {}));
exports.default = CryptoWallet.CryptoWalletJS;
