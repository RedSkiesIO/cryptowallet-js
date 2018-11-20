"use strict";
exports.__esModule = true;
var bip39 = require("bip39");
var bip44hdkey = require("hdkey");
var CryptyoWallet;
(function (CryptyoWallet) {
    var SDKS;
    (function (SDKS) {
        var GenericSDK = /** @class */ (function () {
            function GenericSDK() {
            }
            GenericSDK.prototype.generateHDWallet = function (entropy, cointype) {
                var root = bip44hdkey.fromMasterSeed(bip39.mnemonicToSeed(entropy)); //root of node tree
                var externalNode = root.derive("m/44'/" + cointype + "'/0'/0");
                var internalNode = root.derive("m/44'/" + cointype + "'/0'/1"); //needed for bitcoin
                return {
                    root: root,
                    externalNode: externalNode,
                    internalNode: internalNode
                };
            };
            ;
            return GenericSDK;
        }());
        SDKS.GenericSDK = GenericSDK;
    })(SDKS = CryptyoWallet.SDKS || (CryptyoWallet.SDKS = {}));
})(CryptyoWallet = exports.CryptyoWallet || (exports.CryptyoWallet = {}));
exports["default"] = CryptyoWallet.SDKS.GenericSDK;
