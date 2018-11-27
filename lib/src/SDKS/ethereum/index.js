"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
///<reference path="../../types/module.d.ts" />
const GenericSDK_1 = require("../GenericSDK");
const bip44hdkey = require("ethereumjs-wallet/hdkey");
const EthereumLib = require("ethereumjs-wallet");
const EthereumTx = require("ethereumjs-tx");
var CryptoWallet;
(function (CryptoWallet) {
    var SDKS;
    (function (SDKS) {
        var Ethereum;
        (function (Ethereum) {
            class EthereumSDK extends GenericSDK_1.default {
                constructor() {
                    super(...arguments);
                    this.ethereumlib = EthereumLib;
                }
                /**
                 *
                 * @param entropy
                 * @param cointype
                 */
                generateHDWallet(entropy) {
                    return super.generateHDWallet(entropy, 'ETHEREUM');
                }
                /**
                 *
                 * @param wallet
                 * @param index
                 */
                generateKeyPair(wallet, index) {
                    const addrNode = bip44hdkey.fromExtendedKey(wallet.externalNode.privateExtendedKey).deriveChild(index);
                    let keypair = {
                        publicKey: addrNode.getWallet().getPublicKeyString(),
                        address: addrNode.getWallet().getChecksumAddressString(),
                        derivationPath: `m/44'/60'/0'/0/${index}`,
                        privateKey: addrNode.getWallet().getPrivateKeyString(),
                        type: 'Ethereum'
                    };
                    return keypair;
                }
                /**
                 *
                 * @param wif
                 */
                importWIF(wif) {
                    const rawKey = Buffer.from(wif, 'hex');
                    const keypair = this.ethereumlib.fromPrivateKey(rawKey);
                    const result = {
                        publicKey: '0x' + keypair.getPublicKeyString(),
                        address: keypair.getChecksumAddressString(),
                        privateKey: '0x' + keypair.getPrivateKey().toString('hex'),
                        type: 'Ethereum'
                    };
                    return result;
                }
                /**
                 *
                 * @param keys
                 */
                gernerateP2SHMultiSig(keys) {
                    throw new Error('Method not use for Ethereum');
                }
                /**
                 *
                 * @param options
                 */
                createRawTx(options) {
                    const privateKey = new Buffer('42193c2610f6f7ff06becfef595b4810d8808bdfee1dba819f69686353093f73', 'hex');
                    const tx = new EthereumTx(options);
                    tx.sign(privateKey);
                    const feeCost = tx.getUpfrontCost();
                    tx.gas = feeCost;
                    return tx;
                }
                /**
                 *
                 * @param tx
                 */
                verifyTxSignature(tx) {
                    if (tx.verifySignature()) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                /**
                 *
                 */
                create1t1tx() {
                    throw new Error('Method not used for ethereum.');
                }
                /**
                 *
                 */
                create2t2tx(txparams) {
                    throw new Error('Method not used for ethereum.');
                }
            }
            Ethereum.EthereumSDK = EthereumSDK;
        })(Ethereum = SDKS.Ethereum || (SDKS.Ethereum = {}));
    })(SDKS = CryptoWallet.SDKS || (CryptoWallet.SDKS = {}));
})(CryptoWallet = exports.CryptoWallet || (exports.CryptoWallet = {}));
exports.default = CryptoWallet.SDKS.Ethereum.EthereumSDK;
