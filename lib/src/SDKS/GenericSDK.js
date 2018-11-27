"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Networks = require("./networks");
const Bip39 = require("bip39");
const Bip44hdkey = require("hdkey");
const Bitcoinlib = require("bitcoinjs-lib");
const Wif = require("wif");
var CryptoWallet;
(function (CryptoWallet) {
    var SDKS;
    (function (SDKS) {
        class GenericSDK {
            constructor() {
                this.bitcoinlib = Bitcoinlib;
                this.networks = Networks;
                this.bip39 = Bip39;
                this.wif = Wif;
            }
            generateHDWallet(entropy, network) {
                const cointype = this.networks[network].bip;
                const root = Bip44hdkey.fromMasterSeed(this.bip39.mnemonicToSeed(entropy)); // root of node tree
                let externalNode, internalNode, bip;
                if (cointype === 0 || cointype === 1) {
                    externalNode = root.derive(`m/49'/${cointype}'/0'/0`);
                    internalNode = root.derive(`m/49'/${cointype}'/0'/1`); // needed for bitcoin
                    bip = 49;
                }
                else {
                    externalNode = root.derive(`m/44'/${cointype}'/0'/0`);
                    internalNode = root.derive(`m/44'/${cointype}'/0'/1`); // needed for bitcoin
                    bip = 44;
                }
                const wallet = {
                    mnemonic: entropy,
                    privateKey: root.privateExtendedKey,
                    externalNode,
                    internalNode,
                    bip,
                    type: cointype,
                    network: this.networks[network]
                };
                return wallet;
            }
            ;
            generateKeyPair(wallet, index) {
                let node = wallet.externalNode;
                if (!external) {
                    node = wallet.internalNode;
                }
                const addrNode = node.deriveChild(index);
                const { address } = this.bitcoinlib.payments.p2sh({
                    redeem: this.bitcoinlib.payments.p2wpkh({ pubkey: addrNode.publicKey, network: wallet.network })
                });
                return [
                    {
                        publicKey: addrNode.publicKey,
                        address: address,
                        privateKey: addrNode.privateKey,
                        derivationPath: `m/${wallet.bip}'/${wallet.type}'/0'/0/${index}`,
                        type: wallet.network.name
                    }
                ];
            }
            ;
        }
        SDKS.GenericSDK = GenericSDK;
    })(SDKS = CryptoWallet.SDKS || (CryptoWallet.SDKS = {}));
})(CryptoWallet = exports.CryptoWallet || (exports.CryptoWallet = {}));
exports.default = CryptoWallet.SDKS.GenericSDK;
