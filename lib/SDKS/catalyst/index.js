var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/**
* Copyright (c) 2019 https://atlascity.io
*
* This file is part of CryptoWallet-js <https://github.com/atlascity/cryptowallet-js>
*
* CryptoWallet-js is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 2 of the License, or
* (at your option) any later version.
*
* CryptoWallet-js is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with CryptoWallet-js. If not, see <https://www.gnu.org/licenses/>.
*/
///<reference path="../../types/module.d.ts" />
import * as Bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import ERPC from '@etclabscore/ethereum-json-rpc';
import CatalystWallet from '@catalyst-net-js/wallet';
import CatalystTx from '@catalyst-net-js/tx';
import * as EthereumLib from 'ethereumjs-wallet';
import * as EthereumTx from 'ethereumjs-tx';
import * as Web3 from 'web3';
import GenericSDK from '../GenericSDK';
export var CryptoWallet;
(function (CryptoWallet) {
    var SDKS;
    (function (SDKS) {
        var Catalyst;
        (function (Catalyst) {
            var CatalystSDK = /** @class */ (function (_super) {
                __extends(CatalystSDK, _super);
                function CatalystSDK() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.ethereumlib = EthereumLib;
                    _this.Web3 = Web3;
                    _this.bip39 = Bip39;
                    _this.walletHdpath = 'm/44\'/42069\'/';
                    return _this;
                }
                CatalystSDK.prototype.generateHDWallet = function (entropy, network) {
                    if (!this.bip39.validateMnemonic(entropy)) {
                        throw new TypeError('Invalid entropy');
                    }
                    var seed = this.bip39.mnemonicToSeedHex(entropy);
                    return {
                        ext: seed,
                        int: null,
                        bip: 44,
                        type: 42069,
                        network: network,
                    };
                };
                ;
                /**
                 * generate an ethereum keypair using a HD wallet object
                 * @param wallet
                 * @param index
                 */
                CatalystSDK.prototype.generateKeyPair = function (wallet, index) {
                    if (!wallet.network || wallet.network.connect) {
                        throw new Error('Invalid wallet type');
                    }
                    var data = derivePath(this.walletHdpath + index + "'", wallet.ext);
                    var wal = CatalystWallet.generateFromSeed(data.key);
                    var keypair = {
                        publicKey: wal.getPublicKeyString(),
                        address: wal.getAddressString(),
                        derivationPath: this.walletHdpath + index + "'",
                        privateKey: wal.getPrivateKeyString(),
                        type: 'Catalyst',
                        network: wallet.network,
                    };
                    return keypair;
                };
                /**
                * generates an etherum address using a HD wallet object
                * @param wallet
                * @param index
                */
                CatalystSDK.prototype.generateAddress = function (wallet, index) {
                    if (!wallet.network || wallet.network.connect) {
                        throw new Error('Invalid wallet type');
                    }
                    var data = derivePath(this.walletHdpath + index + "'", wallet.ext);
                    var wal = CatalystWallet.generateFromSeed(data.key);
                    var address = {
                        index: index,
                        address: wal.getAddressString(),
                        type: wallet.network.name,
                    };
                    return address;
                };
                /**
                 * A method that checks if an address is a valid Ethereum address
                 * @param address
                 * @param network
                 */
                CatalystSDK.prototype.validateAddress = function (address, network) {
                    var web3 = new this.Web3(this.networks[network].provider);
                    return web3.utils.isAddress(address.toLowerCase());
                };
                /**
                * gets the estimated cost of a transaction
                * TODO: only works for bitcoin currently
                * @param network
                */
                CatalystSDK.prototype.getTransactionFee = function (network) {
                    var _this = this;
                    if (!this.networks[network] || this.networks[network].connect) {
                        throw new Error('Invalid network');
                    }
                    return new Promise(function (resolve, reject) {
                        var URL = _this.networks[network].feeApi;
                        var gasLimit = 21000;
                        var weiMultiplier = 1000000000000000000;
                        _this.axios.get(URL)
                            .then(function (r) { return resolve({
                            high: r.data.high_gas_price,
                            medium: r.data.medium_gas_price,
                            low: r.data.low_gas_price,
                            txHigh: (r.data.high_gas_price * gasLimit) / weiMultiplier,
                            txMedium: (r.data.medium_gas_price * gasLimit) / weiMultiplier,
                            txLow: (r.data.low_gas_price * gasLimit) / weiMultiplier,
                        }); })
                            .catch(function (e) { return reject(e.message); });
                    });
                };
                /**
                 * Restore an ethereum keypair using a private key
                 * @param wif
                 * @param network
                 */
                CatalystSDK.prototype.importWIF = function (wif, network) {
                    var rawKey = Buffer.from(wif, 'hex');
                    var keypair = this.ethereumlib.fromPrivateKey(rawKey);
                    var result = {
                        publicKey: "0x" + keypair.getPublicKeyString(),
                        address: keypair.getChecksumAddressString(),
                        privateKey: "0x" + keypair.getPrivateKey().toString('hex'),
                        type: this.networks[network].name,
                    };
                    return result;
                };
                /**
                 *  Create an Ethereum raw transaction
                 * @param keypair
                 * @param toAddress
                 * @param amount
                 */
                CatalystSDK.prototype.createEthTx = function (keypair, toAddress, amount, gasPrice) {
                    var _this = this;
                    var web3 = new this.Web3(keypair.network.provider);
                    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var nonce, sendAmount, gasAmount, gasLimit, tx, raw, convertToSeconds, transaction;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, web3.eth.getTransactionCount(keypair.address)];
                                case 1:
                                    nonce = _a.sent();
                                    sendAmount = amount.toString();
                                    gasAmount = gasPrice.toString();
                                    gasLimit = 21000;
                                    tx = new CatalystTx({
                                        nonce: nonce,
                                        gasPrice: web3.utils.toHex(gasAmount),
                                        gasLimit: web3.utils.toHex(gasLimit),
                                        to: toAddress,
                                        value: web3.utils.toHex(web3.utils.toWei(sendAmount)),
                                        data: '0x0',
                                    });
                                    return [4 /*yield*/, tx.sign(keypair.privateKey)];
                                case 2:
                                    _a.sent();
                                    raw = "0x" + tx.serialize().toString('hex');
                                    convertToSeconds = 1000;
                                    transaction = {
                                        hash: web3.utils.sha3(raw),
                                        fee: web3.utils.fromWei((gasPrice * gasLimit).toString(), 'ether'),
                                        receiver: toAddress,
                                        confirmed: false,
                                        confirmations: 0,
                                        blockHeight: -1,
                                        sent: true,
                                        value: amount,
                                        sender: keypair.address,
                                        receivedTime: new Date().getTime() / convertToSeconds,
                                        confirmedTime: new Date().getTime() / convertToSeconds,
                                    };
                                    return [2 /*return*/, resolve({
                                            transaction: transaction,
                                            hexTx: raw,
                                        })];
                            }
                        });
                    }); });
                };
                /**
                 *  Broadcast an Ethereum transaction
                 * @param rawTx
                 * @param network
                 */
                CatalystSDK.prototype.broadcastTx = function (rawTx, network) {
                    var _this = this;
                    var web3 = new this.Web3(this.networks[network].provider);
                    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            web3.eth.sendSignedTransaction(rawTx, function (err, hash) {
                                if (err)
                                    return reject(err);
                                return resolve({
                                    hash: hash,
                                });
                            });
                            return [2 /*return*/];
                        });
                    }); });
                };
                /**
                 *  Verify the signature of an Ethereum transaction object
                 * @param tx
                 */
                CatalystSDK.prototype.verifyTxSignature = function (tx) {
                    var transaction = new EthereumTx(tx);
                    this.VerifyTx = tx;
                    if (transaction.verifySignature()) {
                        return true;
                    }
                    return false;
                };
                /**
                 * Gets the transaction history for an array of addresses
                 * @param addresses
                 * @param network
                 * @param startBlock
                 * @param endBlock
                 */
                CatalystSDK.prototype.getTransactionHistory = function (addresses, network, startBlock, endBlock) {
                    var _this = this;
                    var rpc = new ERPC({
                        transport: {
                            host: '77.68.110.194',
                            port: 5005,
                            type: 'http',
                            path: '/api/eth/request',
                        },
                    });
                    var getBlocks = function (from, to, erpc) { return __awaiter(_this, void 0, void 0, function () {
                        var promises, i;
                        return __generator(this, function (_a) {
                            promises = [];
                            for (i = from; i <= to; i += 1) {
                                promises.push(erpc.eth_getBlockByNumber("0x" + i.toString(16), true));
                            }
                            return [2 /*return*/, Promise.all(promises)];
                        });
                    }); };
                    var getTxs = function (txHashes, erpc) { return __awaiter(_this, void 0, void 0, function () {
                        var promises, txs;
                        return __generator(this, function (_a) {
                            promises = [];
                            txHashes.forEach(function (hash) {
                                promises.push(erpc.eth_getTransactionByHash(hash));
                            });
                            txs = Promise.all(promises);
                            console.log(txs);
                            return [2 /*return*/, txs];
                        });
                    }); };
                    var fetchTxs = function (address) { return __awaiter(_this, void 0, void 0, function () {
                        var txHashes, txTimestamps, blocks, txs;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    txHashes = [];
                                    txTimestamps = {};
                                    return [4 /*yield*/, getBlocks(startBlock, endBlock, rpc)];
                                case 1:
                                    blocks = _a.sent();
                                    blocks.forEach(function (_a) {
                                        var transactions = _a.transactions, timestamp = _a.timestamp;
                                        console.log(transactions);
                                        if (transactions.length > 0) {
                                            txHashes.push.apply(txHashes, transactions);
                                            transactions.forEach(function (tx) {
                                                txTimestamps[tx] = timestamp;
                                            });
                                        }
                                        ;
                                    });
                                    return [4 /*yield*/, getTxs(txHashes, rpc)];
                                case 2:
                                    txs = _a.sent();
                                    return [2 /*return*/, txs.reduce(function (filtered, tx) {
                                            if (tx.from === addresses[0] || tx.to === address) {
                                                tx.timestamp = txTimestamps[tx.hash];
                                                filtered.push(tx);
                                            }
                                            return filtered;
                                        }, [])];
                            }
                        });
                    }); };
                    var transactions = [];
                    var minConfirmations = 1;
                    var weiMultiplier = 1000000000000000000;
                    var gweiMultiplier = 1000000000;
                    var getHistory = function (address) { return __awaiter(_this, void 0, void 0, function () {
                        var txs;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, fetchTxs(address)];
                                case 1:
                                    txs = _a.sent();
                                    txs.forEach(function (r) {
                                        var receiver = r.to;
                                        var sent = false;
                                        var confirmed = false;
                                        var contractCall = false;
                                        if (r.from === address.toLowerCase()) {
                                            sent = true;
                                        }
                                        if (r.confirmations >= minConfirmations) {
                                            confirmed = true;
                                        }
                                        if (!r.to) {
                                            receiver = r.contractAddress;
                                            contractCall = true;
                                        }
                                        var transaction = {
                                            sent: sent,
                                            receiver: receiver,
                                            contractCall: contractCall,
                                            confirmed: confirmed,
                                            hash: r.hash,
                                            blockHeight: parseInt(r.blockNumber, 16),
                                            fee: (parseInt(r.cumulativeGasUsed, 16) / gweiMultiplier).toString(),
                                            value: parseInt(r.value, 16) / weiMultiplier,
                                            sender: r.from,
                                            receivedTime: parseInt(r.timestamp, 16),
                                            confirmedTime: parseInt(r.timestamp, 16),
                                            confirmations: 1,
                                        };
                                        transactions.push(transaction);
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var promises, e_1, history;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    promises = [];
                                    addresses.forEach(function (address) { return __awaiter(_this, void 0, void 0, function () {
                                        var _this = this;
                                        return __generator(this, function (_a) {
                                            promises.push(new Promise(function (res, rej) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                                return [2 /*return*/, res(getHistory(address))];
                                            }); }); }));
                                            return [2 /*return*/];
                                        });
                                    }); });
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, Promise.all(promises)];
                                case 2:
                                    _a.sent();
                                    return [3 /*break*/, 4];
                                case 3:
                                    e_1 = _a.sent();
                                    return [2 /*return*/, reject(e_1)];
                                case 4:
                                    history = {
                                        addresses: addresses,
                                        totalTransactions: transactions.length,
                                        txs: transactions,
                                    };
                                    return [2 /*return*/, resolve(history)];
                            }
                        });
                    }); });
                };
                /**
                 * Gets the total balance of an array of addresses
                 * @param addresses
                 * @param network
                 */
                CatalystSDK.prototype.getBalance = function (addresses, network) {
                    var _this = this;
                    var rpc = new ERPC({
                        transport: {
                            host: '77.68.110.194',
                            port: 5005,
                            type: 'http',
                            path: '/api/eth/request',
                        },
                    });
                    var balance = 0;
                    var promises = [];
                    var weiMultiplier = 1000000000000000000;
                    var getAddrBalance = function (addr) { return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var bal;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, rpc.eth_getBalance(addr)];
                                case 1:
                                    bal = _a.sent();
                                    resolve(bal ? (parseInt(bal, 16) / weiMultiplier) : 0);
                                    return [2 /*return*/];
                            }
                        });
                    }); }); };
                    return getAddrBalance(addresses[0]);
                    // return new Promise(async (resolve, reject) => {
                    //   addresses.forEach((addr) => {
                    //     promises.push(
                    //       new Promise(async (res, rej) => res(getAddrBalance(addr))),
                    //     );
                    //   });
                    //   try {
                    //     await Promise.all(promises);
                    //   } catch (e) { return reject(e); }
                    //   const weiMultiplier = 1000000000000000000;
                    //   // const dust = 1000000000000;
                    //   // if (balance < dust) return resolve(0);
                    //   return resolve(parseInt(balance, 16) / weiMultiplier);
                    // });
                };
                /**
                 * Generates the first 10 accounts of an ethereum wallet
                 * @param entropy
                 * @param network
                 * @param internal
                 */
                CatalystSDK.prototype.accountDiscovery = function (wallet, internal) {
                    var accounts = [];
                    var numberOfAccounts = 10;
                    for (var i = 0; i < numberOfAccounts; i += 1) {
                        var key = this.generateKeyPair(wallet, i);
                        var account = {
                            address: key.address,
                            index: i,
                            type: wallet.network.name,
                        };
                        accounts.push(account);
                    }
                    return accounts;
                };
                return CatalystSDK;
            }(GenericSDK));
            Catalyst.CatalystSDK = CatalystSDK;
        })(Catalyst = SDKS.Catalyst || (SDKS.Catalyst = {}));
    })(SDKS = CryptoWallet.SDKS || (CryptoWallet.SDKS = {}));
})(CryptoWallet || (CryptoWallet = {}));
export default CryptoWallet.SDKS.Catalyst.CatalystSDK;
