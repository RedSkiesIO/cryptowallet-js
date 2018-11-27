var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GenericSDK_1 = require('../GenericSDK');
var bitcoinjs_lib_1 = require('bitcoinjs-lib');
var CryptyoWallet;
(function (CryptyoWallet) {
    var SDKS;
    (function (SDKS) {
        var Bitcoin;
        (function (Bitcoin) {
            var BitcoinSDK = (function (_super) {
                __extends(BitcoinSDK, _super);
                function BitcoinSDK() {
                    _super.apply(this, arguments);
                    this.bitcoinlib = bitcoinjs_lib_1["default"];
                }
                BitcoinSDK.prototype.generateSegWitAddress = function (keyPair) {
                    return this.bitcoinlib.payments.p2wpkh({ pubkey: keyPair.publicKey });
                };
                BitcoinSDK.prototype.generateSegWitP2SH = function (keyPair) {
                    return this.bitcoinlib.payments.p2sh({
                        redeem: this.bitcoinlib.payments.p2wpkh({ pubkey: keyPair.publicKey })
                    });
                };
                BitcoinSDK.prototype.generateSegWit3of4MultiSigAddress = function (key1, key2, key3, key4) {
                    var pubKeys = [key1, key2, key3, key4].map(function (hex) { return Buffer.from(hex, 'hex'); });
                    return this.bitcoinlib.payments.p2wsh({
                        redeem: this.bitcoinlib.payments.p2ms({ m: 3, pubKeys: pubKeys })
                    });
                };
                /* generateKeyPair() is an placeholder to satisfy GenericSDK intarfece, I went with
                 * generateKeyPairFromPublicKey, generateKeyPairFromPrivateKey and
                 * generateKeyPairFromWIF instead
                 */
                BitcoinSDK.prototype.generateKeyPair = function (entropy) {
                    return {};
                };
                BitcoinSDK.prototype.generateKeyPairFromPublicKey = function (publicKey) {
                    return this.bitcoinlib.ECPair.fromPublicKey(new Buffer(publicKey, 'hex'));
                };
                BitcoinSDK.prototype.generateKeyPairFromPrivateKey = function (privateKey) {
                    return this.bitcoinlib.ECPair.fromPrivateKey(new Buffer(privateKey, 'hex'));
                };
                BitcoinSDK.prototype.generateKeyPairFromWIF = function (wif) {
                    return this.bitcoinlib.ECPair.fromWIF(wif);
                };
                BitcoinSDK.prototype.importWIF = function (wif) {
                    // no idea what should go here
                };
                BitcoinSDK.prototype.gernerateP2SHMultiSig = function (keys) {
                    var pubKeys = keys.map(function (hex) { return Buffer.from(hex, 'hex'); });
                    return this.bitcoinlib.payments.p2sh({
                        redeem: this.bitcoinlib.payments.p2ms({ m: pubKeys.length, pubKeys: pubKeys })
                    });
                };
                BitcoinSDK.prototype.generateTestNetAddress = function (keyPair) {
                    var testnet = this.bitcoinlib.networks.testnet;
                    return this.bitcoinlib.payments.p2pkh({ pubkey: keyPair.publicKey, network: testnet }).address;
                };
                BitcoinSDK.prototype.createTX = function (keyPair, input, output, outputValue) {
                    var txb = new this.bitcoinlib.TransactionBuilder();
                    txb.setVersion(1);
                    txb.addInput(input, 0);
                    txb.addOutput(output, outputValue);
                    txb.sign(0, keyPair);
                    return txb.build().toHex();
                };
                BitcoinSDK.prototype.verifyTxSignature = function (pubKeys, txHex) {
                    var _this = this;
                    var keyPairs = pubKeys.map(function (q) {
                        return _this.bitcoinlib.ECPair.fromPublicKey(Buffer.from(q, 'hex'));
                    });
                    var tx = this.bitcoinlib.Transaction.fromHex(txHex);
                    var valid = [];
                    tx.ins.forEach(function (input, i) {
                        var keyPair = keyPairs[i];
                        var p2pkh = _this.bitcoinlib.payments.p2pkh({
                            pubkey: keyPair.publicKey,
                            input: input.script
                        });
                        var ss = _this.bitcoinlib.script.signature.decode(p2pkh.signature);
                        var hash = tx.hashForSignature(i, p2pkh.output, ss.hashType);
                        valid.push(hash === ss.signature);
                    });
                    return valid.every(function (item) { return item === true; });
                };
                return BitcoinSDK;
            })(GenericSDK_1["default"]);
        })(Bitcoin = SDKS.Bitcoin || (SDKS.Bitcoin = {}));
    })(SDKS = CryptyoWallet.SDKS || (CryptyoWallet.SDKS = {}));
})(CryptyoWallet || (CryptyoWallet = {}));
exports["default"] = CryptyoWallet.SDKS.Bitcoin.BitcoinSDK;
