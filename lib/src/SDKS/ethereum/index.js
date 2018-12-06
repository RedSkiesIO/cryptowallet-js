"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// /<reference path="../../types/module.d.ts" />
const GenericSDK_1 = require("../GenericSDK");
const bip44hdkey = require("ethereumjs-wallet/hdkey");
const EthereumLib = require("ethereumjs-wallet");
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
                getUTXOs(addresses, network) {
                    throw new Error("Method not implemented.");
                }
                createRawTx(accounts, change, utxos, network, toAddress, amount) {
                    throw new Error("Method not implemented.");
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
                 * @param keypair
                 * @param toAddress
                 * @param amount
                 */
                // createRawTx(keypair: any, toAddress: String, amount: number): Object {
                //   const privateKey = new Buffer(keypair.privateKey.substr(2), 'hex')
                //   const web3 = new Web3(new Web3.providers.httpProvider('https://ropsten.infura.io/v61hsMvKfFW08T9q4Msu'))
                //   return new Promise((resolve, reject) => {
                //     web3.eth.getTransactionCount(keypair, function (err: any, nonce: any) {
                //       if (err) {
                //         return reject(err)
                //       }
                //       const tx = new EthereumTx({
                //         nonce: nonce,
                //         gasPrice: web3.toHex(web3.toWei('20', 'gwei')),
                //         gasLimit: web3.toHex(100000),
                //         to: toAddress,
                //         value: web3.toHex(web3.toWei(amount)),
                //         chainId: 3
                //       })
                //       tx.sign(privateKey)
                //       const raw = '0x' + tx.serialize().toString('hex')
                //       return resolve(raw)
                //     })
                //   })
                // }
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
                getTransactionHistory(address, addresses, network, lastBlock, beforeBlock, limit) {
                    return new Promise(async (resolve, reject) => {
                        const URL = 'http://api-ropsten.etherscan.io/api?module=account&action=txlist&address=' + address + '&startblock=' + lastBlock + '&sort=desc&apikey=' + this.networks.ethToken;
                        await this.axios.get(URL)
                            .then(async (res) => {
                            if (!res.data.result) {
                                return resolve();
                            }
                            else {
                                let transactions = [];
                                const nextBlock = 0; //res.data.result[0].blockNumber
                                res.data.result.forEach((r) => {
                                    let receiver = r.to, sent = false, confirmed = false, contractCall = false;
                                    if (r.from === address.toLowerCase()) {
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
                                        hash: r.hash,
                                        blockHeight: r.blockNumber,
                                        fee: r.cumulativeGasUsed,
                                        sent: sent,
                                        value: r.value,
                                        sender: r.from,
                                        receiver: receiver,
                                        contractCall: contractCall,
                                        confirmed: confirmed,
                                        confirmedTime: r.timeStamp
                                    };
                                    transactions.push(transaction);
                                });
                                let balance = 0;
                                await this.axios.get('https://api-ropsten.etherscan.io/api?module=account&action=balance&address=' + address + '&tag=latest&apikey=' + this.networks.ethToken)
                                    .then((res) => {
                                    balance = res.data.result;
                                    const history = {
                                        address: address,
                                        balance: balance,
                                        totalTransactions: transactions.length,
                                        nextBlock: nextBlock,
                                        txs: transactions
                                    };
                                    return resolve(history);
                                });
                            }
                        });
                    });
                }
                getWalletHistory(addresses, network, lastBlock, full) {
                    const result = [];
                    return new Promise((resolve, reject) => {
                        const promises = [];
                        addresses.forEach((address) => {
                            promises.push(new Promise(async (resolve, reject) => {
                                const history = await this.getTransactionHistory(address, addresses, network, 0, lastBlock);
                                if (history.totalTransactions > 0) {
                                    result.push(history);
                                }
                                resolve();
                            }));
                        });
                        Promise.all(promises).then(() => {
                            resolve(result);
                        });
                    });
                }
                accountDiscovery(entropy, network, internal) {
                    const wallet = this.generateHDWallet(entropy, network);
                    const accounts = [];
                    for (let i = 0; i < 10; i++) {
                        const key = this.generateKeyPair(wallet, i);
                        const account = {
                            address: key.address,
                            index: i
                        };
                        accounts.push(account);
                    }
                    return accounts;
                    // var api = require('etherscan-api').init(this.networks.ethToken, 'ropsten', '3000');
                    // let usedAddresses: any = []
                    // let emptyAddresses: any = []
                    // let transactions: any = []
                    // let balance: number = 0
                    // let txs: any = []
                    // function checkAddress(address: string, i: number): Promise<object> {
                    //   return new Promise(async (resolve, reject) => {
                    //     let addrBalance = 0;
                    //     let result: object;
                    //     const txlist = api.account.txlist(address)
                    //     txlist.then(function (data: any) {
                    //       console.log('api called')
                    //       console.log(data)
                    //       console.log(data.status)
                    //       if (data) {
                    //         const getBalance = api.account.balance(address)
                    //         getBalance.then(function (value: any) {
                    //           addrBalance = value.result
                    //           balance += value.result
                    //           result = {
                    //             address: address,
                    //             balance: addrBalance,
                    //             index: i
                    //           }
                    //           console.log(result)
                    //           usedAddresses.push(result)
                    //           data.result.forEach((tx: any) => {
                    //             let sent = false
                    //             let receiver = tx.to
                    //             let contractCall = false
                    //             let confirmed = false
                    //             if (tx.from === address) {
                    //               sent = true
                    //             }
                    //             if (!tx.to) {
                    //               receiver = tx.contractAddress
                    //               contractCall = true
                    //             }
                    //             if (tx.confirmations > 11) {
                    //               confirmed = true
                    //             }
                    //             const transaction = {
                    //               hash: tx.hash,
                    //               blockHeight: tx.blockNumber,
                    //               fee: tx.cumulativeGasUsed,
                    //               sent: sent,
                    //               value: tx.value,
                    //               senders: tx.from,
                    //               receiver: receiver,
                    //               contractCall: contractCall,
                    //               confirmed: confirmed,
                    //               confirmedTime: tx.timeStamp
                    //             }
                    //             transactions.push(transaction)
                    //           })
                    //         });
                    //       }
                    //       else {
                    //         emptyAddresses.push(i)
                    //       }
                    //       return resolve({ address })
                    //     });
                    //   });
                    // }
                    // console.log('promise entered')
                    // return new Promise(async (resolve, reject) => {
                    //   let discover = true
                    //   let startIndex = 0
                    //   while (discover) {
                    //     let promises = []
                    //     for (let i: any = startIndex; i < startIndex + 20; i++) {
                    //       const keypair: any = this.generateKeyPair(wallet, i)
                    //       promises.push(new Promise(async (resolve, reject) => {
                    //         return resolve(checkAddress(keypair.address, i))
                    //       })
                    //       )
                    //     }
                    //     console.log('all promises started')
                    //     await Promise.all(promises)
                    //     if (emptyAddresses.length > 0) {
                    //       const min = Math.min(...emptyAddresses)
                    //       startIndex = min
                    //     }
                    //     if (emptyAddresses.length > 20) {
                    //       discover = false
                    //     }
                    //   }
                    //   const result = {
                    //     balance: balance,
                    //     used: usedAddresses,
                    //     nextAddress: startIndex,
                    //     txs: txs
                    //   }
                    //   console.log(emptyAddresses)
                    //   return resolve(result)
                    // })
                    //   .catch(function (reason) {
                    //     console.log('ERROR: ' + reason)
                    //   })
                }
            }
            Ethereum.EthereumSDK = EthereumSDK;
        })(Ethereum = SDKS.Ethereum || (SDKS.Ethereum = {}));
    })(SDKS = CryptoWallet.SDKS || (CryptoWallet.SDKS = {}));
})(CryptoWallet = exports.CryptoWallet || (exports.CryptoWallet = {}));
exports.default = CryptoWallet.SDKS.Ethereum.EthereumSDK;
