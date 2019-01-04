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
                 * generate an ethereum keypair using a HD wallet object
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
                * generates an etherum address using a HD wallet object
                * @param wallet
                * @param index
                */
                generateAddress(wallet, index) {
                    const addrNode = this.Bip.fromExtendedKey(wallet.externalNode.privateExtendedKey).deriveChild(index);
                    const address = {
                        index,
                        address: addrNode.getWallet().getChecksumAddressString(),
                        type: wallet.name,
                    };
                    return address;
                }
                /**
                 * A method that checks if an address is a valid Ethereum address
                 * @param address
                 * @param network
                 */
                validateAddress(address, network) {
                    const web3 = new this.Web3(new Web3.providers.HttpProvider(this.networks[network].provider));
                    return web3.utils.isAddress(address);
                }
                /**
                * gets the estimated cost of a transaction
                * TODO: only works for bitcoin currently
                * @param network
                */
                getTransactionFee(network) {
                    return new Promise((resolve, reject) => {
                        if (this.networks[network].connect) {
                            throw new Error('Invalid network type');
                        }
                        const URL = this.networks[network].feeApi;
                        this.axios.get(URL)
                            .then((r) => resolve({
                            high: r.data.high_gas_price,
                            medium: r.data.medium_gas_price,
                            low: r.data.low_gas_price,
                            txHigh: (r.data.high_gas_price * 21000) / 1000000000000000000,
                            txMedium: (r.data.medium_gas_price * 21000) / 1000000000000000000,
                            txLow: (r.data.low_gas_price * 21000) / 1000000000000000000,
                        }));
                    });
                }
                /**
                 * Restore an ethereum keypair using a private key
                 * @param wif
                 * @param network
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
                 *  Create an Ethereum raw transaction
                 * @param keypair
                 * @param toAddress
                 * @param amount
                 */
                createEthTx(keypair, toAddress, amount, gasPrice) {
                    const privateKey = Buffer.from(keypair.privateKey.substr(2), 'hex');
                    const web3 = new this.Web3(new Web3.providers.HttpProvider(keypair.network.provider));
                    return new Promise((resolve, reject) => {
                        web3.eth.getTransactionCount(keypair.address, (err, nonce) => {
                            if (err) {
                                return reject(err);
                            }
                            const sendAmount = amount.toString();
                            const gasAmount = gasPrice.toString();
                            const tx = new EthereumTx({
                                nonce,
                                gasPrice: web3.utils.toHex(gasAmount),
                                gasLimit: web3.utils.toHex(21000),
                                to: toAddress,
                                value: web3.utils.toHex(web3.utils.toWei(sendAmount)),
                                chainId: keypair.network.chainId,
                            });
                            tx.sign(privateKey);
                            const raw = `0x${tx.serialize().toString('hex')}`;
                            const transaction = {
                                hash: web3.utils.sha3(raw),
                                fee: web3.utils.fromWei((gasPrice * 21000).toString(), 'gwei'),
                                receiver: toAddress,
                                confirmed: false,
                                confirmations: 0,
                                blockHeight: -1,
                                sent: true,
                                value: amount,
                                sender: keypair.address,
                                receivedTime: new Date().getTime() / 1000,
                                confirmedTime: undefined,
                            };
                            return resolve({
                                transaction,
                                hexTx: raw,
                            });
                        });
                    });
                }
                /**
                 *  Broadcast an Ethereum transaction
                 * @param rawTx
                 * @param network
                 */
                broadcastTx(rawTx, network) {
                    const web3 = new Web3(new Web3.providers.HttpProvider(this.networks[network].provider));
                    return new Promise((resolve, reject) => {
                        web3.eth.sendSignedTransaction(rawTx, (err, hash) => {
                            if (err)
                                return reject(err);
                            return resolve({
                                hash,
                            });
                        });
                    });
                }
                /**
                 *  Verify the signature of an Ethereum transaction object
                 * @param tx
                 */
                verifyTxSignature(tx) {
                    const transaction = new EthereumTx(tx);
                    this.VerifyTx = tx;
                    if (transaction.verifySignature()) {
                        return true;
                    }
                    return false;
                }
                /**
                 * Gets the transaction history for an array of addresses
                 * @param addresses
                 * @param network
                 * @param startBlock
                 * @param endBlock
                 */
                getTransactionHistory(addresses, network, startBlock, endBlock) {
                    const transactions = [];
                    const getHistory = (address) => new Promise(async (resolve, reject) => {
                        const URL = `${this.networks[network].getTranApi
                            + address}&startblock=${startBlock}&sort=desc&apikey=${this.networks.ethToken}`;
                        await this.axios.get(URL)
                            .then(async (res) => {
                            if (!res.data.result) {
                                return resolve();
                            }
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
                                    fee: r.cumulativeGasUsed / 1000000000,
                                    value: r.value / 1000000000000000000,
                                    sender: r.from,
                                    confirmedTime: r.timeStamp,
                                    confirmations: r.confirmations,
                                };
                                transactions.push(transaction);
                            });
                            return resolve();
                        });
                    });
                    return new Promise(async (resolve, reject) => {
                        const promises = [];
                        addresses.forEach(async (address) => {
                            promises.push(new Promise(async (res, rej) => res(getHistory(address))));
                        });
                        await Promise.all(promises);
                        const history = {
                            addresses,
                            totalTransactions: transactions.length,
                            txs: transactions,
                        };
                        return resolve(history);
                    });
                }
                /**
                 * Gets the total balance of an array of addresses
                 * @param addresses
                 * @param network
                 */
                getBalance(addresses, network) {
                    let balance = 0;
                    const promises = [];
                    const getAddrBalance = (addr) => new Promise(async (resolve, reject) => {
                        const URL = `${this.networks[network].getBalanceApi + addr}&tag=latest&apikey=${this.networks.ethToken}`;
                        await this.axios.get(URL)
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
                        return resolve(balance / 1000000000000000000);
                    });
                }
                /**
                 * Generates the first 10 accounts of an ethereum wallet
                 * @param entropy
                 * @param network
                 * @param internal
                 */
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
