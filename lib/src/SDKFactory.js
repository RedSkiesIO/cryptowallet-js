"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bitcoin_1 = require("./SDKS/bitcoin");
const ethereum_1 = require("./SDKS/ethereum");
var CryptoWallet;
(function (CryptoWallet) {
    function createSDK(sdk) {
        switch (sdk) {
            case 'Bitcoin':
                return new bitcoin_1.default();
            case 'Ethereum':
                return new ethereum_1.default();
            default:
                return new bitcoin_1.default();
        }
    }
    CryptoWallet.createSDK = createSDK;
})(CryptoWallet = exports.CryptoWallet || (exports.CryptoWallet = {}));
