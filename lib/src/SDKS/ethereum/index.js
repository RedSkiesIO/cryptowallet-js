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
                // getTransactionHistory(address: string, network: string, lastBlock: number, beforeBlock?: number, limit?: number): Object {
                //   var api = require('etherscan-api').init('YourApiKey','ropsten', '3000');
                //   var txlist = api.account.txlist('0x3FAcfa472e86E3EDaEaa837f6BA038ac01F7F539');
                //   txlist.then(function (res: any) {
                //     res.result.forEach((r:any)=>{
                //       let sent, confirmed = false
                //       if(r.from === address){
                //         sent = true
                //       }
                //       if(r.confirmations > 11){
                //         confirmed = true
                //       }
                //       const transaction = {
                //         hash: r.hash,
                //         blockHeight: r.blockNumber,
                //         fee: r.cumulativeGasUsed,
                //         sent: sent,
                //         value: r.value,
                //         sender: r.from,
                //         receiver: r.to,
                //         confirmed: confirmed,
                //         confirmedTime: r.timeStamp
                //       }
                //     })
                //   })
                // }
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
                getWalletHistory(addresses, network, lastBlock, full) {
                    throw new Error('Method not used for ethereum.');
                }
                accountDiscovery(entropy, network, internal) {
                    const wallet = this.generateHDWallet(entropy);
                    var api = require('etherscan-api').init(this.networks.ethToken, 'ropsten', '3000');
                    let usedAddresses = [];
                    let emptyAddresses = [];
                    let transactions = [];
                    let balance = 0;
                    let txs = [];
                    function checkAddress(address, i) {
                        return new Promise(async (resolve, reject) => {
                            let addrBalance = 0;
                            let result;
                            const txlist = api.account.txlist(address);
                            txlist.then(function (data) {
                                if (data.result.status === 1) {
                                    const getBalance = api.account.balance(address);
                                    getBalance.then(function (value) {
                                        addrBalance = value.result;
                                        balance += value.result;
                                    });
                                    result = {
                                        address: address,
                                        balance: addrBalance,
                                        index: i
                                    };
                                    usedAddresses.push(result);
                                    data.result.forEach((tx) => {
                                        let sent = false;
                                        let receiver = tx.to;
                                        let contractCall = false;
                                        let confirmed = false;
                                        if (tx.from === address) {
                                            sent = true;
                                        }
                                        if (!tx.to) {
                                            receiver = tx.contractAddress;
                                            contractCall = true;
                                        }
                                        if (tx.confirmations > 11) {
                                            confirmed = true;
                                        }
                                        const transaction = {
                                            hash: tx.hash,
                                            blockHeight: tx.blockNumber,
                                            fee: tx.cumulativeGasUsed,
                                            sent: sent,
                                            value: tx.value,
                                            senders: tx.from,
                                            receiver: receiver,
                                            contractCall: contractCall,
                                            confirmed: confirmed,
                                            confirmedTime: tx.timeStamp
                                        };
                                        transactions.push(transaction);
                                    });
                                }
                                else {
                                    emptyAddresses.push(i);
                                }
                                return resolve(result);
                            });
                        });
                    }
                    return new Promise(async (resolve, reject) => {
                        let discover = true;
                        let startIndex = 0;
                        while (discover) {
                            let promises = [];
                            for (let i = startIndex; i < startIndex + 20; i++) {
                                const keypair = this.generateKeyPair(wallet, i);
                                promises.push(new Promise(async (resolve, reject) => {
                                    return resolve(checkAddress(keypair.address, i));
                                }));
                            }
                            await Promise.all(promises);
                            if (emptyAddresses.length > 0) {
                                const min = Math.min(...emptyAddresses);
                                startIndex = min;
                            }
                            if (emptyAddresses.length > 20) {
                                discover = false;
                            }
                        }
                        const result = {
                            used: usedAddresses,
                            nextAddress: startIndex,
                            txs: txs
                        };
                        return resolve(result);
                    });
                }
            }
            Ethereum.EthereumSDK = EthereumSDK;
        })(Ethereum = SDKS.Ethereum || (SDKS.Ethereum = {}));
    })(SDKS = CryptoWallet.SDKS || (CryptoWallet.SDKS = {}));
})(CryptoWallet = exports.CryptoWallet || (exports.CryptoWallet = {}));
exports.default = CryptoWallet.SDKS.Ethereum.EthereumSDK;
