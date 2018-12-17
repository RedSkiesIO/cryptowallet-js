"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-unresolved */
// eslint-disable-next-line spaced-comment
///<reference path="../../types/module.d.ts" />
const bip44hdkey = require("ethereumjs-wallet/hdkey");
const EthereumLib = require("ethereumjs-wallet");
const EthereumTx = require("ethereumjs-tx");
const Web3 = require("web3");
const GenericSDK_1 = require("../GenericSDK");
var CryptoWallet;
(function (CryptoWallet) {
    var SDKS;
    (function (SDKS) {
        var Ethereum;
        (function (Ethereum) {
            class EthereumSDK extends GenericSDK_1.default {
                constructor() {
                    super(...arguments);
                    this.Bip = bip44hdkey;
                    this.ethereumlib = EthereumLib;
                    this.Web3 = Web3;
                }
                /**
                 *
                 * @param wallet
                 * @param index
                 */
                generateKeyPair(wallet, index) {
                    const addrNode = this.Bip.fromExtendedKey(wallet.externalNode.privateExtendedKey).deriveChild(index);
                    const keypair = {
                        publicKey: addrNode.getWallet().getPublicKeyString(),
                        address: addrNode.getWallet().getChecksumAddressString(),
                        derivationPath: `m/44'/60'/0'/0/${index}`,
                        privateKey: addrNode.getWallet().getPrivateKeyString(),
                        type: 'Ethereum',
                        network: wallet.network,
                    };
                    return keypair;
                }
                /**
                 *
                 * @param wif
                 */
                importWIF(wif, network) {
                    const rawKey = Buffer.from(wif, 'hex');
                    const keypair = this.ethereumlib.fromPrivateKey(rawKey);
                    const result = {
                        publicKey: `0x${keypair.getPublicKeyString()}`,
                        address: keypair.getChecksumAddressString(),
                        privateKey: `0x${keypair.getPrivateKey().toString('hex')}`,
                        type: this.networks[network].name,
                    };
                    return result;
                }
                /**
                 *
                 * @param keypair
                 * @param toAddress
                 * @param amount
                 */
                createEthTx(keypair, toAddress, amount) {
                    const privateKey = Buffer.from(keypair.privateKey.substr(2), 'hex');
                    const web3 = new this.Web3(new Web3.providers.HttpProvider(keypair.network.provider));
                    return new Promise((resolve, reject) => {
                        web3.eth.getTransactionCount(keypair.address, (err, nonce) => {
                            if (err) {
                                return reject(err);
                            }
                            const sendAmount = amount.toString();
                            const tx = new EthereumTx({
                                nonce,
                                gasPrice: web3.utils.toHex(web3.utils.toWei('20', 'gwei')),
                                gasLimit: web3.utils.toHex(100000),
                                to: toAddress,
                                value: web3.utils.toHex(web3.utils.toWei(sendAmount)),
                                chainId: 3,
                            });
                            tx.sign(privateKey);
                            const raw = `0x${tx.serialize().toString('hex')}`;
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
                    const web3 = new Web3(new Web3.providers.HttpProvider(this.networks[network].provider));
                    return new Promise((resolve, reject) => {
                        web3.eth.sendSignedTransaction(rawTx, (err, result) => {
                            if (err)
                                return console.log('error', err);
                            console.log('sent', result);
                            return resolve(result);
                        });
                    });
                }
                /**
                 *
                 * @param tx
                 */
                verifyTxSignature(tx) {
                    this.VerifyTx = tx;
                    if (tx.verifySignature()) {
                        return true;
                    }
                    return false;
                }
                getTransactionHistory(addresses, network, startBlock, endBlock) {
                    return new Promise(async (resolve, reject) => {
                        const URL = `${this.networks[network].getTranApi
                            + addresses[0]}&startblock=${startBlock}&sort=desc&apikey=${this.networks.ethToken}`;
                        await this.axios.get(URL)
                            .then(async (res) => {
                            if (!res.data.result) {
                                return resolve();
                            }
                            const transactions = [];
                            const nextBlock = 0; // res.data.result[0].blockNumber
                            res.data.result.forEach((r) => {
                                let receiver = r.to;
                                let sent = false;
                                let confirmed = false;
                                let contractCall = false;
                                if (r.from === addresses[0].toLowerCase()) {
                                    sent = true;
                                }
                                if (r.confirmations > 11) {
                                    confirmed = true;
                                }
                                if (!r.to) {
                                    receiver = r.contractAddress;
                                    contractCall = true;
                                }
                                const transaction = {
                                    sent,
                                    receiver,
                                    contractCall,
                                    confirmed,
                                    hash: r.hash,
                                    blockHeight: r.blockNumber,
                                    fee: r.cumulativeGasUsed,
                                    value: r.value,
                                    sender: r.from,
                                    confirmedTime: r.timeStamp,
                                };
                                transactions.push(transaction);
                            });
                            const history = {
                                addresses,
                                nextBlock,
                                totalTransactions: transactions.length,
                                txs: transactions,
                            };
                            return resolve(history);
                        });
                    });
                }
                getBalance(addresses, network) {
                    let balance = 0;
                    const promises = [];
                    const getAddrBalance = (addr) => new Promise(async (resolve, reject) => {
                        await this.axios.get(`${this.networks[network].getBalanceApi + addr}
    &tag=latest&apikey=${this.networks.ethToken}`)
                            .then((bal) => {
                            balance += bal.data.result;
                            resolve();
                        });
                    });
                    return new Promise(async (resolve, reject) => {
                        addresses.forEach((addr) => {
                            promises.push(new Promise(async (res, rej) => res(getAddrBalance(addr))));
                        });
                        await Promise.all(promises);
                        return balance;
                    });
                }
                // getWalletHistory(
                //   addresses: string[],
                //   network: string,
                //   lastBlock: number,
                //   full?: boolean,
                // )
                //   : Object {
                //   const result: any = [];
                //   return new Promise((resolve, reject) => {
                //     const promises: any = [];
                //     addresses.forEach((address: any) => {
                //       promises.push(
                //         new Promise(async (res, rej) => {
                //           const history: any = await this.getTransactionHistory(
                //             address, addresses, network, 0, lastBlock,
                //           );
                //           if (history.totalTransactions > 0) {
                //             result.push(history);
                //           }
                //           res();
                //         }),
                //       );
                //     });
                //     Promise.all(promises).then(() => {
                //       resolve(result);
                //     });
                //   });
                // }
                accountDiscovery(entropy, network, internal) {
                    const wallet = this.generateHDWallet(entropy, network);
                    const accounts = [];
                    for (let i = 0; i < 10; i += 1) {
                        const key = this.generateKeyPair(wallet, i);
                        const account = {
                            address: key.address,
                            index: i,
                        };
                        accounts.push(account);
                    }
                    return accounts;
                }
            }
            Ethereum.EthereumSDK = EthereumSDK;
        })(Ethereum = SDKS.Ethereum || (SDKS.Ethereum = {}));
    })(SDKS = CryptoWallet.SDKS || (CryptoWallet.SDKS = {}));
})(CryptoWallet = exports.CryptoWallet || (exports.CryptoWallet = {}));
exports.default = CryptoWallet.SDKS.Ethereum.EthereumSDK;
