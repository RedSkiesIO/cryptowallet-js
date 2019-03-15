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
import * as EthereumTx from 'ethereumjs-tx';
import * as Web3 from 'web3';
import * as Axios from 'axios';
import ERC20JSON from './erc20';
import * as Networks from '../networks';
export var CryptoWallet;
(function (CryptoWallet) {
    var SDKS;
    (function (SDKS) {
        var ERC20;
        (function (ERC20) {
            var ERC20SDK = /** @class */ (function () {
                function ERC20SDK() {
                    this.json = ERC20JSON;
                    this.networks = Networks;
                    this.axios = Axios;
                    this.Tx = EthereumTx;
                    this.Web3 = Web3;
                }
                /**
                 * Creates an object containg all the information relating to a ERC20 token
                 *  and the account it's stored on
                 * @param keypair
                 * @param tokenName
                 * @param tokenSymbol
                 * @param contractAddress
                 * @param decimals
                 */
                ERC20SDK.prototype.generateERC20Wallet = function (keypair, tokenName, tokenSymbol, contractAddress, decimals) {
                    var web3 = new this.Web3(keypair.network.provider);
                    var valid = web3.utils.isAddress(contractAddress.toLowerCase());
                    if (!valid) {
                        throw new Error('This is not a valid ERC20 contract address');
                    }
                    return {
                        decimals: decimals,
                        address: keypair.address,
                        network: keypair.network,
                        name: tokenName,
                        symbol: tokenSymbol,
                        contract: contractAddress,
                    };
                };
                /**
                 * Only used internally to create a raw transaction
                 * @param erc20Wallet
                 * @param method
                 */
                ERC20SDK.prototype.createTx = function (erc20Wallet, keypair, method, gasPrice, to, amount) {
                    var _this = this;
                    var web3 = new this.Web3(erc20Wallet.network.provider);
                    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var nonce, gas, gasLimit, tx, removePrefix, privateKey, raw, fee, msToS, transaction;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, web3.eth.getTransactionCount(erc20Wallet.address)];
                                case 1:
                                    nonce = _a.sent();
                                    gas = gasPrice.toString();
                                    gasLimit = 100000;
                                    tx = new this.Tx({
                                        nonce: nonce,
                                        gasPrice: web3.utils.toHex(gas),
                                        gasLimit: web3.utils.toHex(gasLimit),
                                        to: erc20Wallet.contract,
                                        value: 0,
                                        data: method,
                                        chainId: erc20Wallet.network.chainId,
                                    });
                                    removePrefix = 2;
                                    privateKey = Buffer.from(keypair.privateKey.substr(removePrefix), 'hex');
                                    tx.sign(privateKey);
                                    raw = "0x" + tx.serialize().toString('hex');
                                    fee = (gasPrice * gasLimit).toString();
                                    msToS = 1000;
                                    transaction = {
                                        fee: fee,
                                        hash: web3.utils.sha3(raw),
                                        receiver: to,
                                        confirmed: false,
                                        confirmations: 0,
                                        blockHeight: -1,
                                        sent: true,
                                        value: amount,
                                        sender: erc20Wallet.address,
                                        receivedTime: new Date().getTime() / msToS,
                                        confirmedTime: new Date().getTime() / msToS,
                                    };
                                    return [2 /*return*/, resolve({
                                            hexTx: raw,
                                            transaction: transaction,
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
                ERC20SDK.prototype.broadcastTx = function (rawTx, network) {
                    var _this = this;
                    var web3 = new this.Web3(this.networks[network].provider);
                    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var hash;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, web3.eth.sendSignedTransaction(rawTx)];
                                case 1:
                                    hash = _a.sent();
                                    return [2 /*return*/, resolve({
                                            hash: hash,
                                        })];
                            }
                        });
                    }); });
                };
                /**
                 * Create a transaction that transafers ERC20 tokens to a give address
                 * @param erc20Wallet
                 * @param to
                 * @param amount
                 */
                ERC20SDK.prototype.transfer = function (erc20Wallet, keypair, to, amount, gasPrice) {
                    var web3 = new this.Web3(erc20Wallet.network.provider);
                    var contract = new web3.eth.Contract(this.json, erc20Wallet.contract);
                    var sendAmount = (amount * (Math.pow(10, erc20Wallet.decimals))).toString();
                    var method = contract.methods.transfer(to, sendAmount).encodeABI();
                    return this.createTx(erc20Wallet, keypair, method, gasPrice, to, amount);
                };
                /**
                 * Create a transaction that approves another account to transfer ERC20 tokens
                 * @param erc20Wallet
                 * @param to
                 * @param amount
                 */
                ERC20SDK.prototype.approveAccount = function (erc20Wallet, keypair, to, amount, gasPrice) {
                    var web3 = new this.Web3(erc20Wallet.network.provider);
                    var contract = new web3.eth.Contract(this.json, erc20Wallet.contract);
                    var sendAmount = (amount * (Math.pow(10, erc20Wallet.decimals))).toString();
                    var method = contract.methods.approve(to, sendAmount).encodeABI();
                    return this.createTx(erc20Wallet, keypair, method, gasPrice);
                };
                /**
                 * Create a transaction that transfers money from another account
                 * @param erc20Wallet
                 * @param from
                 * @param amount
                 */
                ERC20SDK.prototype.transferAllowance = function (erc20Wallet, keypair, from, amount, gasPrice) {
                    var _this = this;
                    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var web3, contract, check, sendAmount, method, tx;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    web3 = new this.Web3(erc20Wallet.network.provider);
                                    contract = new web3.eth.Contract(this.json, erc20Wallet.contract);
                                    return [4 /*yield*/, this.checkAllowance(erc20Wallet, from)];
                                case 1:
                                    check = _a.sent();
                                    if (check >= amount) {
                                        sendAmount = (amount * (Math.pow(10, erc20Wallet.decimals))).toString();
                                        method = contract.methods.transferFrom(from, erc20Wallet.address, sendAmount).encodeABI();
                                        tx = this.createTx(erc20Wallet, keypair, method, gasPrice);
                                        return [2 /*return*/, resolve(tx)];
                                    }
                                    return [2 /*return*/, resolve("You don't have enough allowance")];
                            }
                        });
                    }); });
                };
                /**
                 * Checks how much can be transfered from another account
                 * @param erc20Wallet
                 * @param from
                 */
                ERC20SDK.prototype.checkAllowance = function (erc20Wallet, from) {
                    var _this = this;
                    this.wallet = erc20Wallet;
                    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var web3, contract, allowance;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    web3 = new this.Web3(erc20Wallet.network.provider);
                                    contract = new web3.eth.Contract(this.json, erc20Wallet.contract);
                                    return [4 /*yield*/, contract.methods.allowance(from, erc20Wallet.address).call()];
                                case 1:
                                    allowance = _a.sent();
                                    return [2 /*return*/, resolve(allowance)];
                            }
                        });
                    }); });
                };
                /**
                 * Gets the balance of the ERC20 token on a users ethereum account
                 * @param erc20Wallet
                 */
                ERC20SDK.prototype.getBalance = function (erc20Wallet) {
                    var _this = this;
                    this.wallet = erc20Wallet;
                    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var web3, contract, balance, adjustedBalance;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    web3 = new this.Web3(erc20Wallet.network.provider);
                                    contract = new web3.eth.Contract(this.json, erc20Wallet.contract);
                                    return [4 /*yield*/, contract.methods.balanceOf(erc20Wallet.address).call()];
                                case 1:
                                    balance = _a.sent();
                                    adjustedBalance = balance / (Math.pow(10, erc20Wallet.decimals));
                                    return [2 /*return*/, resolve(adjustedBalance)];
                            }
                        });
                    }); });
                };
                ERC20SDK.prototype.getTokenData = function (address, network) {
                    var _this = this;
                    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var web3, abiArray, contract, valid, decimals, name_1, symbol, err_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    web3 = new this.Web3(this.networks[network].provider);
                                    abiArray = this.json;
                                    contract = new web3.eth.Contract(abiArray, address);
                                    return [4 /*yield*/, web3.eth.getCode(address)];
                                case 1:
                                    valid = _a.sent();
                                    if (valid === '0x') {
                                        return [2 /*return*/, reject(new Error('This is not a valid ERC20 contract address'))];
                                    }
                                    return [4 /*yield*/, contract.methods.balanceOf('0xcc345035D14458B3C012977f96fA1E116760D60a').call()
                                            .catch(function (error) { return reject(new Error('Not a valid ERC20 contract address')); })];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3:
                                    _a.trys.push([3, 7, , 8]);
                                    return [4 /*yield*/, contract.methods.decimals().call()];
                                case 4:
                                    decimals = _a.sent();
                                    return [4 /*yield*/, contract.methods.name().call()];
                                case 5:
                                    name_1 = _a.sent();
                                    return [4 /*yield*/, contract.methods.symbol().call()];
                                case 6:
                                    symbol = _a.sent();
                                    return [2 /*return*/, resolve({
                                            name: name_1,
                                            symbol: symbol,
                                            decimals: decimals,
                                        })];
                                case 7:
                                    err_1 = _a.sent();
                                    return [2 /*return*/, resolve()];
                                case 8: return [2 /*return*/];
                            }
                        });
                    }); });
                };
                /**
                 * gets the transaction histroy of the ERC20 token on a users Ethereum account
                 * @param erc20Wallet
                 * @param lastBlock
                 */
                ERC20SDK.prototype.getTransactionHistory = function (erc20Wallet, startBlock) {
                    var _this = this;
                    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var URL;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    URL = erc20Wallet.network.getErc20TranApi + erc20Wallet.contract + "&address=" + erc20Wallet.address + "&startblock=" + startBlock + "&sort=desc&apikey=" + this.networks.ethToken;
                                    if (typeof startBlock === 'undefined') {
                                        URL = erc20Wallet.network.getErc20TranApi + erc20Wallet.contract + "&address=" + erc20Wallet.address + "&sort=desc&apikey=" + this.networks.ethToken;
                                    }
                                    return [4 /*yield*/, this.axios.get(URL)
                                            .then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                                            var transactions, minConfirmations, convertToEth;
                                            return __generator(this, function (_a) {
                                                if (!res.data.result) {
                                                    return [2 /*return*/, resolve()];
                                                }
                                                transactions = [];
                                                minConfirmations = 11;
                                                convertToEth = 1000000000;
                                                res.data.result.forEach(function (r) {
                                                    var receiver = r.to;
                                                    var sent = false;
                                                    var confirmed = false;
                                                    if (r.from === erc20Wallet.address.toLowerCase()) {
                                                        sent = true;
                                                    }
                                                    if (r.confirmations > minConfirmations) {
                                                        confirmed = true;
                                                    }
                                                    var transaction = {
                                                        sent: sent,
                                                        receiver: receiver,
                                                        confirmed: confirmed,
                                                        hash: r.hash,
                                                        blockHeight: r.blockNumber,
                                                        fee: r.cumulativeGasUsed / convertToEth,
                                                        value: r.value / (Math.pow(10, erc20Wallet.decimals)),
                                                        sender: r.from,
                                                        confirmedTime: r.timeStamp,
                                                        confirmations: r.confirmations,
                                                    };
                                                    transactions.push(transaction);
                                                });
                                                return [2 /*return*/, resolve(transactions)];
                                            });
                                        }); })
                                            .catch(function (e) { return reject(e); })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                };
                return ERC20SDK;
            }());
            ERC20.ERC20SDK = ERC20SDK;
        })(ERC20 = SDKS.ERC20 || (SDKS.ERC20 = {}));
    })(SDKS = CryptoWallet.SDKS || (CryptoWallet.SDKS = {}));
})(CryptoWallet || (CryptoWallet = {}));
export default CryptoWallet.SDKS.ERC20.ERC20SDK;
