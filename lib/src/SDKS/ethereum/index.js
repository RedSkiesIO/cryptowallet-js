"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// /<reference path="../../types/module.d.ts" />
const GenericSDK_1 = require("../GenericSDK");
const bip44hdkey = require("ethereumjs-wallet/hdkey");
const EthereumLib = require("ethereumjs-wallet");
const EthereumTx = require("ethereumjs-tx");
const Web3 = require("web3");
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
                    this.web3 = Web3;
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
                    const keypair = {
                        publicKey: addrNode.getWallet().getPublicKeyString(),
                        address: addrNode.getWallet().getChecksumAddressString(),
                        derivationPath: `m/44'/60'/0'/0/${index}`,
                        privateKey: addrNode.getWallet().getPrivateKeyString(),
                        type: 'Ethereum',
                        network: wallet.network
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
                    throw new Error('Method not used for Ethereum');
                }
                /**
                 *
                 * @param keypair
                 * @param toAddress
                 * @param amount
                 */
                createRawTx(keypair, toAddress, amount) {
                    const privateKey = new Buffer(keypair.privateKey.substr(2), 'hex');
                    const web3 = new Web3(new Web3.providers.httpProvider('https://ropsten.infura.io/v61hsMvKfFW08T9q4Msu'));
                    return new Promise((resolve, reject) => {
                        web3.eth.getTransactionCount(keypair, function (err, nonce) {
                            if (err) {
                                return reject(err);
                            }
                            const tx = new EthereumTx({
                                nonce: nonce,
                                gasPrice: web3.toHex(web3.toWei('20', 'gwei')),
                                gasLimit: web3.toHex(100000),
                                to: toAddress,
                                value: web3.toHex(web3.toWei(amount)),
                                chainId: 3
                            });
                            tx.sign(privateKey);
                            const raw = '0x' + tx.serialize().toString('hex');
                            return resolve(raw);
                        });
                    });
                }
                /**
                 *
                 * @param rawTx
                 * @param network
                 */
                broadcastTx(rawTx, network) {
                    const tx = {
                        tx: rawTx
                    };
                    return new Promise((resolve, reject) => {
                        this.request.post({ url: this.networks[network].sendTxApi, form: JSON.stringify(tx) }, function (error, body, result) {
                            if (error) {
                                return reject('Transaction failed: ' + error);
                            }
                            const output = JSON.parse(result);
                            result = output.tx.hash;
                            return resolve(result);
                        });
                    });
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
                accountDiscovery(entropy, netork) {
                    throw new Error('Method not used for ethereum.');
                }
                getWalletHistory(addresses, network, lastBlock, full) {
                    throw new Error('Method not used for ethereum.');
                }
            }
            Ethereum.EthereumSDK = EthereumSDK;
        })(Ethereum = SDKS.Ethereum || (SDKS.Ethereum = {}));
    })(SDKS = CryptoWallet.SDKS || (CryptoWallet.SDKS = {}));
})(CryptoWallet = exports.CryptoWallet || (exports.CryptoWallet = {}));
exports.default = CryptoWallet.SDKS.Ethereum.EthereumSDK;
