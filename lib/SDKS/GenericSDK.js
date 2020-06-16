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
///<reference path="./../types/module.d.ts" />
import * as Bip39 from 'bip39';
import * as Bip44hdkey from 'hdkey';
import * as Bitcoinlib from 'bitcoinjs-lib';
import * as Wif from 'wif';
import axios from 'axios';
import * as Coinselect from 'coinselect';
import * as CoinSelectSplit from 'coinselect/split';
import * as Networks from './networks';
export var CryptoWallet;
(function (CryptoWallet) {
    var SDKS;
    (function (SDKS) {
        var GenericSDK = /** @class */ (function () {
            function GenericSDK(network) {
                this.bitcoinlib = Bitcoinlib;
                this.networks = Networks;
                this.bip39 = Bip39;
                this.wif = Wif;
                this.axios = axios;
                if (network) {
                    this.networkInfo = network;
                }
            }
            /**
             * generates an hierarchical determinitsic wallet for a given coin type
             * @param entropy
             * @param network
             */
            GenericSDK.prototype.generateHDWallet = function (entropy, net) {
                if (!this.bip39.validateMnemonic(entropy)) {
                    throw new TypeError('Invalid entropy');
                }
                var network = this.networkInfo ? this.networkInfo : this.networks[net];
                if (!network) {
                    throw new Error('Invalid network');
                }
                var cointype = network.bip;
                // root of node tree
                var root = Bip44hdkey.fromMasterSeed(this.bip39.mnemonicToSeed(entropy));
                var externalNode;
                var internalNode;
                var bip = 0;
                var segWitBip = 49;
                var nonSegWitBip = 44;
                // check if coin type supports segwit
                if (network.segwit) {
                    externalNode = root.derive("m/49'/" + cointype + "'/0'/0");
                    internalNode = root.derive("m/49'/" + cointype + "'/0'/1"); // for change addresses
                    bip = segWitBip;
                }
                else if (network.name === 'REGTEST') {
                    externalNode = root.derive('m/0');
                    internalNode = root.derive('m/1');
                    bip = 0;
                }
                else {
                    externalNode = root.derive("m/44'/" + cointype + "'/0'/0");
                    internalNode = root.derive("m/44'/" + cointype + "'/0'/1"); // for change addresses
                    bip = nonSegWitBip;
                }
                var wallet = {
                    bip: bip,
                    ext: externalNode.toJSON(),
                    int: internalNode.toJSON(),
                    type: cointype,
                    network: network,
                };
                return wallet;
            };
            /**
            * This method creates a keypair from a wallet object and a given index
            * @param wallet
            * @param index
            * @param internal
            */
            GenericSDK.prototype.generateKeyPair = function (wallet, index, internal) {
                if (!wallet.network.connect) {
                    throw new Error('Invalid wallet type');
                }
                var node = Bip44hdkey.fromJSON(wallet.ext);
                if (internal) {
                    node = Bip44hdkey.fromJSON(wallet.int);
                }
                var addrNode = node.deriveChild(index);
                var result = this.bitcoinlib.payments.p2sh({
                    redeem: this.bitcoinlib.payments.p2wpkh({
                        pubkey: addrNode.publicKey,
                        network: wallet.network.connect,
                    }),
                    network: wallet.network.connect,
                });
                if (!wallet.network.segwit) {
                    result = this.bitcoinlib.payments.p2pkh({
                        pubkey: addrNode.publicKey, network: wallet.network.connect,
                    });
                }
                var address = result.address;
                var keypair = {
                    address: address,
                    publicKey: addrNode.publicKey.toString('hex'),
                    privateKey: this.wif.encode(wallet.network.connect.wif, addrNode.privateKey, true),
                    derivationPath: "m/" + wallet.bip + "'/" + wallet.type + "'/0'/0/" + index,
                    type: wallet.network.name,
                    network: wallet.network,
                    change: internal,
                };
                return keypair;
            };
            /**
            * This method generates an address from a wallet object and a given index.
            * @param wallet
            * @param index
            * @param external
            */
            GenericSDK.prototype.generateAddress = function (wallet, index, internal) {
                if (!wallet.network.connect) {
                    throw new Error('Invalid wallet type');
                }
                var node = Bip44hdkey.fromJSON(wallet.ext);
                if (internal) {
                    node = Bip44hdkey.fromJSON(wallet.int);
                }
                var addrNode = node.deriveChild(index);
                var result = this.bitcoinlib.payments.p2sh({
                    redeem: this.bitcoinlib.payments.p2wpkh({
                        pubkey: addrNode.publicKey,
                        network: wallet.network.connect,
                    }),
                    network: wallet.network.connect,
                });
                if (!wallet.network.segwit) {
                    result = this.bitcoinlib.payments.p2pkh({
                        pubkey: addrNode.publicKey, network: wallet.network.connect,
                    });
                }
                var address = result.address;
                var addr = {
                    address: address,
                    index: index,
                    type: wallet.network.name,
                    change: internal,
                };
                return addr;
            };
            /**
             *  Restore  a keypair using a WIF
             * @param wif
             * @param network
             */
            GenericSDK.prototype.importWIF = function (wif, net) {
                var network = this.networkInfo ? this.networkInfo : this.networks[net];
                if (!network || !network.connect) {
                    throw new Error('Invalid network type');
                }
                var keyPair = this.bitcoinlib.ECPair.fromWIF(wif, network.connect);
                var result = this.bitcoinlib.payments.p2sh({
                    redeem: this.bitcoinlib.payments.p2wpkh({
                        pubkey: keyPair.publicKey,
                        network: network.connect,
                    }),
                    network: network.connect,
                });
                if (!network.segwit) {
                    result = this.bitcoinlib.payments.p2pkh({
                        pubkey: keyPair.publicKey, network: network.connect,
                    });
                }
                var address = result.address;
                return {
                    address: address,
                    keyPair: keyPair,
                };
            };
            /**
             * broadcasts a transaction
             * @param tx
             * @param network
             */
            GenericSDK.prototype.broadcastTx = function (tx, net) {
                var _this = this;
                var network = this.networkInfo ? this.networkInfo : this.networks[net];
                if (!network || !network.connect) {
                    throw new Error('Invalid network type');
                }
                return new Promise(function (resolve, reject) {
                    if (network.segwit) {
                        _this.axios.post(network.broadcastUrl, { tx_hex: tx })
                            .then(function (r) {
                            var res = r.data.data.txid;
                            return resolve(res);
                        })
                            .catch(function (e) { return reject(new Error('Transaction failed')); });
                    }
                    else {
                        _this.axios.post(network.discovery + "/tx/send", { rawtx: tx })
                            .then(function (r) {
                            var txid = r.data.txid;
                            return resolve(txid);
                        })
                            .catch(function (e) { return reject(new Error('Transaction failed')); });
                    }
                });
            };
            /**
             * validates an address
             * @param address
             * @param network
             */
            GenericSDK.prototype.validateAddress = function (address, net) {
                var network = this.networkInfo ? this.networkInfo : this.networks[net];
                try {
                    this.bitcoinlib.address.toOutputScript(address, network.connect);
                }
                catch (e) {
                    return false;
                }
                return true;
            };
            /**
             * gets the estimated cost of a transaction
             * TODO: only works for bitcoin currently
             * @param network
             */
            GenericSDK.prototype.getTransactionFee = function (net) {
                var _this = this;
                var network = this.networkInfo ? this.networkInfo : this.networks[net];
                if (!network || !network.connect) {
                    throw new Error('Invalid network type');
                }
                return new Promise(function (resolve, reject) {
                    var URL = network.feeApi;
                    var kbToBytes = 1000;
                    _this.axios.get(URL)
                        .then(function (r) {
                        resolve({
                            high: r.data.high_fee_per_kb / kbToBytes,
                            medium: r.data.medium_fee_per_kb / kbToBytes,
                            low: r.data.low_fee_per_kb / kbToBytes,
                        });
                    })
                        .catch(function (error) { return reject(error.message); });
                });
            };
            /**
            * returns a transaction object that contains the raw transaction hex
            * @param keypair
            * @param toAddress
            * @param amount
            */
            GenericSDK.prototype.createRawTx = function (accounts, change, utxos, wallet, toAddress, amount, minerRate, max) {
                var _this = this;
                if (!wallet || !wallet.network || !wallet.network.connect) {
                    throw new Error('Invalid wallet type');
                }
                if (!this.validateAddress(toAddress, wallet.network.name)) {
                    throw new Error("Invalid to address \"" + toAddress + "\"");
                }
                var feeRate = minerRate;
                var satoshisMultiplier = 100000000;
                var transactionAmount = Math.floor((amount * satoshisMultiplier));
                var net = wallet.network;
                var rawTx;
                return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var balance, i, targets_1, result, inputs_1, inputs_2, outputs, fee, accountsUsed_1, p2shUsed_1, changeInputUsed_1, txb_1, maxValue_1, i_1, senders_1, convertMstoS, txInputs, transaction, spentInput;
                    var _this = this;
                    return __generator(this, function (_a) {
                        if (utxos.length === 0) {
                            // if no transactions have happened, there is no balance on the address.
                            return [2 /*return*/, reject(new Error("You don't have enough balance to cover transaction"))];
                        }
                        balance = 0;
                        for (i = 0; i < utxos.length; i += 1) {
                            balance += utxos[i].value;
                        }
                        // check whether the balance of the address covers the miner fee
                        if ((balance - transactionAmount) > 0) {
                            targets_1 = [{
                                    address: toAddress,
                                    value: transactionAmount,
                                },
                            ];
                            result = Coinselect(utxos, targets_1, feeRate);
                            if (change.length > 1) {
                                change.forEach(function (c) {
                                    var tar = {
                                        address: c,
                                    };
                                    targets_1.push(tar);
                                });
                                inputs_1 = result.inputs;
                                result = CoinSelectSplit(inputs_1, targets_1, feeRate);
                            }
                            if (max) {
                                targets_1 = [{
                                        address: toAddress,
                                    }];
                                result = CoinSelectSplit(utxos, targets_1, feeRate);
                            }
                            inputs_2 = result.inputs, outputs = result.outputs;
                            fee = result.fee;
                            accountsUsed_1 = [];
                            p2shUsed_1 = [];
                            changeInputUsed_1 = [];
                            inputs_2.forEach(function (input) {
                                accounts.forEach(function (account) {
                                    var key;
                                    if (input.address === account.address) {
                                        if (account.change) {
                                            key = _this.generateKeyPair(wallet, account.index, true);
                                            changeInputUsed_1.push(account);
                                        }
                                        else {
                                            key = _this.generateKeyPair(wallet, account.index);
                                        }
                                        var keyPair = _this.bitcoinlib.ECPair.fromWIF(key.privateKey, net.connect);
                                        var p2wpkh = _this.bitcoinlib.payments.p2wpkh({ pubkey: keyPair.publicKey, network: net.connect });
                                        var p2sh = _this.bitcoinlib.payments.p2sh({ redeem: p2wpkh, network: net.connect });
                                        accountsUsed_1.push(keyPair);
                                        p2shUsed_1.push(p2sh);
                                    }
                                });
                            });
                            txb_1 = new this.bitcoinlib.TransactionBuilder(net.connect);
                            txb_1.setVersion(1);
                            inputs_2.forEach(function (input) {
                                txb_1.addInput(input.txid, input.vout);
                            });
                            maxValue_1 = 0;
                            if (max) {
                                outputs.forEach(function (output) {
                                    maxValue_1 += output.value;
                                });
                                txb_1.addOutput(toAddress, maxValue_1);
                            }
                            else {
                                outputs.forEach(function (output) {
                                    var address = output.address;
                                    if (!output.address) {
                                        (address = change[0]);
                                    }
                                    txb_1.addOutput(address, output.value);
                                });
                            }
                            i_1 = 0;
                            inputs_2.forEach(function (input) {
                                if (wallet.network.segwit) {
                                    txb_1.sign(i_1, accountsUsed_1[i_1], p2shUsed_1[i_1].redeem.output, undefined, inputs_2[i_1].value);
                                }
                                else {
                                    txb_1.sign(i_1, accountsUsed_1[i_1]);
                                }
                                i_1 += 1;
                            });
                            rawTx = txb_1.build().toHex();
                            senders_1 = [];
                            convertMstoS = 1000;
                            txInputs = inputs_2.map(function (input) {
                                senders_1.push(input.address);
                                return input.txid;
                            });
                            fee /= satoshisMultiplier;
                            transaction = {
                                fee: fee,
                                change: change,
                                receiver: [toAddress],
                                confirmed: false,
                                inputs: txInputs,
                                confirmations: 0,
                                hash: txb_1.build().getId(),
                                blockHeight: -1,
                                sent: true,
                                value: amount,
                                sender: senders_1,
                                receivedTime: new Date().getTime() / convertMstoS,
                                confirmedTime: undefined,
                            };
                            if (max) {
                                transaction.value = maxValue_1 / satoshisMultiplier;
                            }
                            spentInput = inputs_2;
                            return [2 /*return*/, resolve({
                                    changeInputUsed: changeInputUsed_1,
                                    transaction: transaction,
                                    hexTx: rawTx,
                                    utxo: spentInput,
                                })];
                        }
                        return [2 /*return*/, reject(new Error("You don't have enough Satoshis to cover the miner fee."))];
                    });
                }); });
            };
            /**
            * verifies the signatures of a transaction object
            * @param transaction
            */
            GenericSDK.prototype.verifyTxSignature = function (transaction, net) {
                var _this = this;
                var network = this.networkInfo ? this.networkInfo : this.networks[net];
                if (!network || !network.connect) {
                    throw new Error('Invalid network type');
                }
                var keyPairs = transaction.pubKeys.map(function (q) { return _this.bitcoinlib.ECPair.fromPublicKey(Buffer.from(q, 'hex'), network.connect); });
                var tx = this.bitcoinlib.Transaction.fromHex(transaction.txHex);
                var valid = [];
                tx.ins.forEach(function (input, i) {
                    var keyPair = keyPairs[i];
                    var p2pkh = _this.bitcoinlib.payments.p2pkh({
                        pubkey: keyPair.publicKey,
                        input: input.script,
                    });
                    var ss = _this.bitcoinlib.script.signature.decode(p2pkh.signature);
                    var hash = tx.hashForSignature(i, p2pkh.output, ss.hashType);
                    valid.push(keyPair.verify(hash, ss.signature));
                });
                return valid.every(function (item) { return item === true; });
            };
            /**
             * This method discovers the addresses which have previously been used in a wallet
             * @param entropy
             * @param network
             * @param internal
             */
            GenericSDK.prototype.accountDiscovery = function (wallet, internal) {
                var _this = this;
                if (!wallet || !wallet.network || !wallet.network.connect) {
                    throw new Error('Invalid wallet type');
                }
                var apiUrl = wallet.network.discovery;
                var usedAddresses = [];
                var usedAddressesIndex = [];
                var emptyAddresses = [];
                var change = false;
                if (internal) {
                    change = true;
                }
                var checkAddress = function (address, i) {
                    var URL = apiUrl + "/addr/" + address + "?noTxList=1";
                    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var addr, result, err_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, this.axios.get(URL)];
                                case 1:
                                    addr = _a.sent();
                                    if (!addr.data) {
                                        return [2 /*return*/, reject(new Error('API ERROR'))];
                                    }
                                    result = {
                                        address: address,
                                        received: addr.data.totalReceived,
                                        balance: addr.data.balance,
                                        index: i,
                                    };
                                    if (result.received > 0) {
                                        usedAddresses.push(result);
                                        usedAddressesIndex.push(result.index);
                                    }
                                    else {
                                        emptyAddresses.push(result.index);
                                    }
                                    return [2 /*return*/, resolve(result)];
                                case 2:
                                    err_1 = _a.sent();
                                    return [2 /*return*/, reject(err_1)];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                };
                return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var startIndex, discover, e_1, result, allAddresses;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                startIndex = 0;
                                discover = function () { return __awaiter(_this, void 0, void 0, function () {
                                    var promises, gapLimit, i, number, keypair, err_2, max;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                promises = [];
                                                gapLimit = 20;
                                                for (i = startIndex; i < startIndex + gapLimit; i += 1) {
                                                    number = i;
                                                    keypair = this.generateKeyPair(wallet, number, internal);
                                                    promises.push(checkAddress(keypair.address, number));
                                                }
                                                _a.label = 1;
                                            case 1:
                                                _a.trys.push([1, 3, , 4]);
                                                return [4 /*yield*/, Promise.all(promises)];
                                            case 2:
                                                _a.sent();
                                                return [3 /*break*/, 4];
                                            case 3:
                                                err_2 = _a.sent();
                                                throw err_2;
                                            case 4:
                                                if (emptyAddresses.length > 0) {
                                                    if (usedAddressesIndex.length > 0) {
                                                        max = Math.max.apply(Math, usedAddressesIndex) + 1;
                                                        startIndex = max;
                                                    }
                                                }
                                                if (!(emptyAddresses.length < gapLimit)) return [3 /*break*/, 6];
                                                emptyAddresses = [];
                                                return [4 /*yield*/, discover()];
                                            case 5:
                                                _a.sent();
                                                _a.label = 6;
                                            case 6: return [2 /*return*/];
                                        }
                                    });
                                }); };
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, discover()];
                            case 2:
                                _a.sent();
                                return [3 /*break*/, 4];
                            case 3:
                                e_1 = _a.sent();
                                return [2 /*return*/, reject(e_1)];
                            case 4:
                                result = {
                                    change: change,
                                    nextAddress: startIndex,
                                };
                                allAddresses = usedAddresses;
                                if (internal) {
                                    result.used = allAddresses;
                                    usedAddresses = usedAddresses.filter(function (item) {
                                        if (item.balance === 0)
                                            return false;
                                        return true;
                                    });
                                }
                                result.active = usedAddresses;
                                return [2 /*return*/, resolve(result)];
                        }
                    });
                }); });
            };
            /**
             * gets the transaction history for an array of addresses
             * @param addresses
             * @param network
             * @param from
             * @param to
             */
            GenericSDK.prototype.getTransactionHistory = function (addresses, net, from, to) {
                var _this = this;
                var network = this.networkInfo ? this.networkInfo : this.networks[net];
                if (!network || !network.connect) {
                    throw new Error('Invalid network');
                }
                var validAddress = function (address) { return _this.validateAddress(address, net); };
                if (!addresses.every(validAddress)) {
                    throw new Error('Invalid address used');
                }
                return new Promise(function (resolve, reject) {
                    var apiUrl = network.discovery;
                    var URL = apiUrl + "/addrs/txs";
                    _this.axios.post(URL, {
                        addrs: addresses.toString(),
                        from: from,
                        to: to,
                    })
                        .then(function (r) {
                        if (r.data.totalItems === 0) {
                            return resolve();
                        }
                        var more = false;
                        if (r.data.totalItems > to) {
                            more = true;
                        }
                        var results = r.data.items;
                        var transactions = [];
                        var minConfirmations = 5;
                        results.forEach(function (result) {
                            var confirmed = false;
                            if (result.confirmations > minConfirmations) {
                                confirmed = true;
                            }
                            var sent = false;
                            var value = 0;
                            var change = [];
                            var receivers = [];
                            var senders = [];
                            var inputs = [];
                            result.vin.forEach(function (input) {
                                if (addresses.includes(input.addr)) {
                                    sent = true;
                                }
                                senders.push(input.addr);
                                inputs.push(input.txid);
                            });
                            result.vout.forEach(function (output) {
                                var outputAddr = output.scriptPubKey.addresses;
                                var v = parseFloat(output.value);
                                outputAddr.forEach(function (addr) {
                                    var ad = addr[0];
                                    if (sent && !addresses.includes(addr)) {
                                        receivers.push(addr);
                                        value += v;
                                    }
                                    else if (!sent && addresses.includes(addr)) {
                                        value += v;
                                        receivers.push(addr);
                                    }
                                    else {
                                        change.push(addr);
                                    }
                                });
                            });
                            var transaction = {
                                sent: sent,
                                value: value,
                                change: change,
                                confirmed: confirmed,
                                inputs: inputs,
                                confirmations: result.confirmations,
                                hash: result.txid,
                                blockHeight: result.blockheight,
                                fee: result.fees,
                                sender: senders,
                                receiver: receivers,
                                receivedTime: result.time,
                                confirmedTime: result.blocktime,
                            };
                            transactions.push(transaction);
                        });
                        var history = {
                            more: more,
                            from: from,
                            to: to,
                            address: addresses,
                            totalTransactions: r.data.totalItems,
                            txs: transactions,
                        };
                        return resolve(history);
                    })
                        .catch(function (error) { return reject(new Error('API failed to get transaction history')); });
                });
            };
            /**
             * gets the total balance of an array of addresses
             * @param addresses
             * @param network
             */
            GenericSDK.prototype.getBalance = function (addresses, net) {
                var _this = this;
                var network = this.networkInfo ? this.networkInfo : this.networks[net];
                if (!network || !network.connect) {
                    throw new Error('Invalid network');
                }
                var validAddress = function (address) { return _this.validateAddress(address, net); };
                if (!addresses.every(validAddress)) {
                    throw new Error('Invalid address used');
                }
                return new Promise(function (resolve, reject) {
                    var balance = 0;
                    var apiUrl = network.discovery;
                    var URL = apiUrl + "/addrs/utxo";
                    _this.axios.post(URL, {
                        addrs: addresses.toString(),
                    })
                        .then(function (r) {
                        if (r.data.length === 0) {
                            balance = 0;
                            return resolve(balance);
                        }
                        r.data.forEach(function (utxo) {
                            balance += utxo.amount;
                        });
                        return resolve(balance);
                    })
                        .catch(function (error) { return reject(new Error('API failed to return a balance')); });
                });
            };
            return GenericSDK;
        }());
        SDKS.GenericSDK = GenericSDK;
    })(SDKS = CryptoWallet.SDKS || (CryptoWallet.SDKS = {}));
})(CryptoWallet || (CryptoWallet = {}));
export default CryptoWallet.SDKS.GenericSDK;
