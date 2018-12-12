"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-unresolved */
// /<reference path="../../types/module.d.ts" />
const Bip39 = require("bip39");
const Bip44hdkey = require("hdkey");
const Bitcoinlib = require("bitcoinjs-lib");
const Wif = require("wif");
const Request = require("request");
const Axios = require("axios");
const Networks = require("./networks");
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
                this.request = Request;
                this.axios = Axios;
            }
            generateHDWallet(entropy, network) {
                const cointype = this.networks[network].bip;
                const root = Bip44hdkey.fromMasterSeed(this.bip39.mnemonicToSeed(entropy)); // root of node tree
                let externalNode;
                let internalNode;
                let bip;
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
                    externalNode,
                    internalNode,
                    bip,
                    mnemonic: entropy,
                    privateKey: root.privateExtendedKey,
                    type: cointype,
                    network: this.networks[network],
                };
                return wallet;
            }
            generateKeyPair(wallet, index, external) {
                let node = wallet.externalNode;
                if (!external) {
                    node = wallet.internalNode;
                }
                const addrNode = node.deriveChild(index);
                const { address } = this.bitcoinlib.payments.p2sh({
                    redeem: this.bitcoinlib.payments.p2wpkh({ pubkey: addrNode.publicKey, network: wallet.network }),
                });
                return [
                    {
                        address,
                        publicKey: addrNode.publicKey,
                        privateKey: addrNode.privateKey,
                        derivationPath: `m/${wallet.bip}'/${wallet.type}'/0'/0/${index}`,
                        type: wallet.network.name,
                    },
                ];
            }
            // abstract getUTXOs(addresses: String[], network: string): Object;
            getWalletHistory(addresses, network, lastBlock, full) {
                const result = [];
                return new Promise((resolve, reject) => {
                    const promises = [];
                    addresses.forEach((address) => {
                        promises.push(new Promise(async (res, rej) => {
                            if (full) {
                                const history = await this.getTransactionHistory(address, addresses, network, lastBlock, undefined, 50);
                                if (typeof history === 'undefined') {
                                    return res();
                                }
                                if (history.hasMore) {
                                    let more = true;
                                    let lBlock = history.lastBlock;
                                    while (more) {
                                        // eslint-disable-next-line no-await-in-loop
                                        const nextData = await this.getTransactionHistory(address, addresses, network, 0, lBlock);
                                        nextData.txs.forEach((tx) => {
                                            history.txs.push(tx);
                                        });
                                        if (typeof nextData.hasMore === 'undefined') {
                                            more = false;
                                        }
                                        lBlock = nextData.lastBlock;
                                    }
                                }
                                result.push(history);
                            }
                            else {
                                const history = await this.getTransactionHistory(address, addresses, network, lastBlock);
                                result.push(history);
                            }
                            return res();
                        }));
                    });
                    Promise.all(promises).then(() => {
                        resolve(result);
                    });
                });
            }
            getTransactionHistory(address, addresses, network, lastBlock, beforeBlock, limit) {
                const apiUrl = this.networks[network].getTranApi;
                let returnAmount = 10;
                if (limit != null) {
                    returnAmount = limit;
                }
                let URL = `${apiUrl + address}/full?${this.networks.token}&after=${lastBlock}&limit=${returnAmount}`;
                if (beforeBlock != null) {
                    URL = `${apiUrl + address}/full?${this.networks.token}&before=${lastBlock}&limit=${returnAmount}`;
                }
                return new Promise((resolve, reject) => {
                    this.axios.get(URL)
                        .then((r) => {
                        if (r.data.txs.length === 0) {
                            return resolve();
                        }
                        const more = r.data.hasMore;
                        const results = r.data.txs;
                        const transactions = [];
                        const oldestBlock = results[results.length - 1].block_height - 1;
                        results.forEach((result) => {
                            let confirmed = false;
                            if (result.confirmations > 5) {
                                confirmed = true;
                            }
                            let sent = false;
                            let value = 0;
                            let change = 0;
                            const receivers = [];
                            const senders = [];
                            result.inputs.forEach((input) => {
                                const inputAddr = input.addresses;
                                inputAddr.forEach((addr) => {
                                    if (addr === address) {
                                        sent = true;
                                    }
                                    senders.push(addr);
                                });
                            });
                            result.outputs.forEach((output) => {
                                const outputAddr = output.addresses;
                                outputAddr.forEach((addr) => {
                                    if (sent && !addresses.includes(addr)) {
                                        receivers.push(addr);
                                        value += output.value;
                                    }
                                    else if (!sent && addresses.includes(addr)) {
                                        ({ value } = output);
                                        receivers.push(addr);
                                    }
                                    else {
                                        change = output.value;
                                    }
                                });
                            });
                            const transaction = {
                                sent,
                                value,
                                change,
                                confirmed,
                                confirmations: result.confirmations,
                                hash: result.hash,
                                blockHeight: result.block_height,
                                fee: result.fees,
                                sender: senders,
                                receiver: receivers,
                                receivedTime: result.received,
                                confirmedTime: result.confirmed,
                            };
                            transactions.push(transaction);
                        });
                        const history = {
                            more,
                            address: r.data.address,
                            balance: r.data.balance,
                            unconfirmedBalance: r.data.unconfirmed_balance,
                            finalBalance: r.data.final_balance,
                            totalTransactions: r.data.n_tx,
                            finalTotalTransactions: r.data.final_n_tx,
                            lastBlock: oldestBlock,
                            txs: transactions,
                        };
                        return resolve(history);
                    })
                        .catch((error) => reject(error));
                });
            }
        }
        SDKS.GenericSDK = GenericSDK;
    })(SDKS = CryptoWallet.SDKS || (CryptoWallet.SDKS = {}));
})(CryptoWallet = exports.CryptoWallet || (exports.CryptoWallet = {}));
exports.default = CryptoWallet.SDKS.GenericSDK;
