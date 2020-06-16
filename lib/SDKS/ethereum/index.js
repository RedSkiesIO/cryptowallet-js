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
import * as bip44hdkey from 'ethereumjs-wallet/hdkey';
import * as EthereumLib from 'ethereumjs-wallet';
import * as EthereumTx from 'ethereumjs-tx';
import * as Web3 from 'web3';
import GenericSDK from '../GenericSDK';
export var CryptoWallet;
(function (CryptoWallet) {
    var SDKS;
    (function (SDKS) {
        var Ethereum;
        (function (Ethereum) {
<<<<<<< HEAD
            class EthereumSDK extends GenericSDK {
                constructor(api) {
                    super(api);
                    this.Bip = bip44hdkey;
                    this.ethereumlib = EthereumLib;
                    this.Web3 = Web3;
                    if (api)
                        this.api = api;
=======
            var EthereumSDK = /** @class */ (function (_super) {
                __extends(EthereumSDK, _super);
                function EthereumSDK(api) {
                    var _this = _super.call(this, api) || this;
                    _this.Bip = bip44hdkey;
                    _this.ethereumlib = EthereumLib;
                    _this.Web3 = Web3;
                    if (api)
                        _this.api = api;
                    return _this;
>>>>>>> develop
                }
                /**
                 * generate an ethereum keypair using a HD wallet object
                 * @param wallet
                 * @param index
                 */
                generateKeyPair(wallet, index) {
                    if (!wallet.network || wallet.network.connect) {
                        throw new Error('Invalid wallet type');
                    }
                    const addrNode = this.Bip.fromExtendedKey(wallet.ext.xpriv).deriveChild(index);
                    const keypair = {
                        publicKey: addrNode.getWallet().getPublicKeyString(),
                        address: addrNode.getWallet().getChecksumAddressString(),
                        derivationPath: `m/44'/60'/0'/0/${index}`,
                        privateKey: addrNode.getWallet().getPrivateKeyString(),
                        type: 'Ethereum',
                        network: this.api || wallet.network,
                    };
                    return keypair;
                }
                /**
                * generates an etherum address using a HD wallet object
                * @param wallet
                * @param index
                */
                generateAddress(wallet, index) {
                    if (!wallet.network || wallet.network.connect) {
                        throw new Error('Invalid wallet type');
                    }
                    const addrNode = this.Bip.fromExtendedKey(wallet.ext.xpriv).deriveChild(index);
                    const address = {
                        index,
                        address: addrNode.getWallet().getChecksumAddressString(),
                        type: wallet.network.name,
                    };
                    return address;
                }
                /**
                 * A method that checks if an address is a valid Ethereum address
                 * @param address
                 * @param network
                 */
<<<<<<< HEAD
                validateAddress(address) {
                    return this.Web3.utils.isAddress(address.toLowerCase());
                }
=======
                EthereumSDK.prototype.validateAddress = function (address) {
                    return this.Web3.utils.isAddress(address.toLowerCase());
                };
>>>>>>> develop
                /**
                * gets the estimated cost of a transaction
                * TODO: only works for bitcoin currently
                * @param network
                */
                getTransactionFee(network) {
                    if (!this.networks[network] || this.networks[network].connect) {
                        throw new Error('Invalid network');
                    }
<<<<<<< HEAD
                    return new Promise((resolve, reject) => {
                        const URL = this.api ? this.api.feeApi : this.networks[network].feeApi;
                        const gasLimit = 21000;
                        const weiMultiplier = 1000000000000000000;
                        this.axios.get(URL)
                            .then((r) => resolve({
=======
                    return new Promise(function (resolve, reject) {
                        var URL = _this.api ? _this.api.feeApi : _this.networks[network].feeApi;
                        var gasLimit = 21000;
                        var weiMultiplier = 1000000000000000000;
                        _this.axios.get(URL)
                            .then(function (r) { return resolve({
>>>>>>> develop
                            high: r.data.high_gas_price,
                            medium: r.data.medium_gas_price,
                            low: r.data.low_gas_price,
                            txHigh: (r.data.high_gas_price * gasLimit) / weiMultiplier,
                            txMedium: (r.data.medium_gas_price * gasLimit) / weiMultiplier,
                            txLow: (r.data.low_gas_price * gasLimit) / weiMultiplier,
                        }))
                            .catch((e) => reject(e.message));
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
                    const removePrefix = 2;
                    const privateKey = Buffer.from(keypair.privateKey.substr(removePrefix), 'hex');
                    const web3 = new this.Web3(keypair.network.provider);
                    return new Promise(async (resolve, reject) => {
                        const nonce = await web3.eth.getTransactionCount(keypair.address);
                        const sendAmount = amount.toString();
                        const gasAmount = gasPrice.toString();
                        const gasLimit = 25000;
                        const tx = new EthereumTx({
                            nonce,
                            gasPrice: web3.utils.toHex(gasAmount),
                            gasLimit: web3.utils.toHex(gasLimit),
                            to: toAddress,
                            value: web3.utils.toHex(web3.utils.toWei(sendAmount)),
                            chainId: keypair.network.chainId,
                        });
                        tx.sign(privateKey);
                        const raw = `0x${tx.serialize().toString('hex')}`;
                        const convertToSeconds = 1000;
                        const transaction = {
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
                        return resolve({
                            transaction,
                            hexTx: raw,
                        });
                    });
                }
                /**
                 *  Broadcast an Ethereum transaction
                 * @param rawTx
                 * @param network
                 */
<<<<<<< HEAD
                broadcastTx(rawTx, network) {
                    const provider = this.api ? this.api.provider : this.networks[network].provider;
                    const web3 = new this.Web3(provider);
                    return new Promise(async (resolve, reject) => {
                        web3.eth.sendSignedTransaction(rawTx, (err, hash) => {
                            if (err)
                                return reject(err);
                            return resolve({
                                hash,
=======
                EthereumSDK.prototype.broadcastTx = function (rawTx, network) {
                    var _this = this;
                    var provider = this.api ? this.api.provider : this.networks[network].provider;
                    var web3 = new this.Web3(provider);
                    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            web3.eth.sendSignedTransaction(rawTx, function (err, hash) {
                                if (err)
                                    return reject(err);
                                return resolve({
                                    hash: hash,
                                });
>>>>>>> develop
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
<<<<<<< HEAD
                getTransactionHistory(addresses, network, startBlock, endBlock) {
                    const transactions = [];
                    const minConfirmations = 11;
                    const weiMultiplier = 1000000000000000000;
                    const gweiMultiplier = 1000000000;
                    const getHistory = (address) => new Promise(async (resolve, reject) => {
                        let URL;
                        if (this.api) {
                            URL = `${this.api.etherscan}?module=account&action=txlist&address=${address}&startblock=${startBlock}&sort=desc` + (this.api.etherscan ? `&apikey=${this.api.etherscanKey}` : null);
                        }
                        else {
                            URL = `${this.networks[network].getTranApi + address}&startblock=${startBlock}&sort=desc&apikey=${this.networks.ethToken}`;
                        }
                        await this.axios.get(URL)
                            .then(async (res) => {
                            if (!res.data.result) {
                                return resolve();
=======
                EthereumSDK.prototype.getTransactionHistory = function (addresses, network, startBlock, endBlock) {
                    var _this = this;
                    var transactions = [];
                    var minConfirmations = 11;
                    var weiMultiplier = 1000000000000000000;
                    var gweiMultiplier = 1000000000;
                    var getHistory = function (address) { return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var URL;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (this.api) {
                                        URL = this.api.etherscan + "?module=account&action=txlist&address=" + address + "&startblock=" + startBlock + "&sort=desc" + (this.api.etherscan ? "&apikey=" + this.api.etherscanKey : null);
                                    }
                                    else {
                                        URL = this.networks[network].getTranApi + address + "&startblock=" + startBlock + "&sort=desc&apikey=" + this.networks.ethToken;
                                    }
                                    return [4 /*yield*/, this.axios.get(URL)
                                            .then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                if (!res.data.result) {
                                                    return [2 /*return*/, resolve()];
                                                }
                                                res.data.result.forEach(function (r) {
                                                    var receiver = r.to;
                                                    var sent = false;
                                                    var confirmed = false;
                                                    var contractCall = false;
                                                    if (r.from === addresses[0].toLowerCase()) {
                                                        sent = true;
                                                    }
                                                    if (r.confirmations > minConfirmations) {
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
                                                        blockHeight: r.blockNumber,
                                                        fee: (r.cumulativeGasUsed / gweiMultiplier).toString(),
                                                        value: r.value / weiMultiplier,
                                                        sender: r.from,
                                                        receivedTime: r.timeStamp,
                                                        confirmedTime: r.timeStamp,
                                                        confirmations: r.confirmations,
                                                    };
                                                    transactions.push(transaction);
                                                });
                                                return [2 /*return*/, resolve()];
                                            });
                                        }); })
                                            .catch(function (e) { return reject(e); })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }); };
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
>>>>>>> develop
                            }
                            res.data.result.forEach((r) => {
                                let receiver = r.to;
                                let sent = false;
                                let confirmed = false;
                                let contractCall = false;
                                if (r.from === addresses[0].toLowerCase()) {
                                    sent = true;
                                }
                                if (r.confirmations > minConfirmations) {
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
                                    fee: (r.cumulativeGasUsed / gweiMultiplier).toString(),
                                    value: r.value / weiMultiplier,
                                    sender: r.from,
                                    receivedTime: r.timeStamp,
                                    confirmedTime: r.timeStamp,
                                    confirmations: r.confirmations,
                                };
                                transactions.push(transaction);
                            });
                            return resolve();
                        })
                            .catch((e) => reject(e));
                    });
                    return new Promise(async (resolve, reject) => {
                        const promises = [];
                        addresses.forEach(async (address) => {
                            promises.push(new Promise(async (res, rej) => res(getHistory(address))));
                        });
                        try {
                            await Promise.all(promises);
                        }
                        catch (e) {
                            return reject(e);
                        }
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
<<<<<<< HEAD
                getBalance(addresses, network) {
                    let balance = 0;
                    const promises = [];
                    const getAddrBalance = (addr) => new Promise(async (resolve, reject) => {
                        let URL;
                        if (this.api) {
                            URL = `${this.api.etherscan}?module=account&action=balance&address=${addr}&tag=latest` + (this.api.etherscan ? `&apikey=${this.api.etherscanKey}` : null);
                        }
                        else {
                            URL = `${this.networks[network].getBalanceApi + addr}&tag=latest&apikey=${this.networks.ethToken}`;
                        }
                        await this.axios.get(URL)
                            .then((bal) => {
                            balance += bal.data.result;
                            resolve();
                        })
                            .catch((e) => reject(e));
                    });
                    return new Promise(async (resolve, reject) => {
                        addresses.forEach((addr) => {
                            promises.push(new Promise(async (res, rej) => res(getAddrBalance(addr))));
=======
                EthereumSDK.prototype.getBalance = function (addresses, network) {
                    var _this = this;
                    var balance = 0;
                    var promises = [];
                    var getAddrBalance = function (addr) { return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var URL;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (this.api) {
                                        URL = this.api.etherscan + "?module=account&action=balance&address=" + addr + "&tag=latest" + (this.api.etherscan ? "&apikey=" + this.api.etherscanKey : null);
                                    }
                                    else {
                                        URL = this.networks[network].getBalanceApi + addr + "&tag=latest&apikey=" + this.networks.ethToken;
                                    }
                                    return [4 /*yield*/, this.axios.get(URL)
                                            .then(function (bal) {
                                            balance += bal.data.result;
                                            resolve();
                                        })
                                            .catch(function (e) { return reject(e); })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }); };
                    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var e_2, weiMultiplier, dust;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    addresses.forEach(function (addr) {
                                        promises.push(new Promise(function (res, rej) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, res(getAddrBalance(addr))];
                                        }); }); }));
                                    });
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, Promise.all(promises)];
                                case 2:
                                    _a.sent();
                                    return [3 /*break*/, 4];
                                case 3:
                                    e_2 = _a.sent();
                                    return [2 /*return*/, reject(e_2)];
                                case 4:
                                    weiMultiplier = 1000000000000000000;
                                    dust = 1000000000000;
                                    if (balance < dust)
                                        return [2 /*return*/, resolve(0)];
                                    return [2 /*return*/, resolve(balance / weiMultiplier)];
                            }
>>>>>>> develop
                        });
                        try {
                            await Promise.all(promises);
                        }
                        catch (e) {
                            return reject(e);
                        }
                        const weiMultiplier = 1000000000000000000;
                        const dust = 1000000000000;
                        if (balance < dust)
                            return resolve(0);
                        return resolve(balance / weiMultiplier);
                    });
                }
                /**
                 * Generates the first 10 accounts of an ethereum wallet
                 * @param entropy
                 * @param network
                 * @param internal
                 */
                accountDiscovery(wallet, internal) {
                    const accounts = [];
                    const numberOfAccounts = 10;
                    for (let i = 0; i < numberOfAccounts; i += 1) {
                        const key = this.generateKeyPair(wallet, i);
                        const account = {
                            address: key.address,
                            index: i,
                            type: wallet.network.name,
                        };
                        accounts.push(account);
                    }
                    return accounts;
                }
            }
            Ethereum.EthereumSDK = EthereumSDK;
        })(Ethereum = SDKS.Ethereum || (SDKS.Ethereum = {}));
    })(SDKS = CryptoWallet.SDKS || (CryptoWallet.SDKS = {}));
})(CryptoWallet || (CryptoWallet = {}));
export default CryptoWallet.SDKS.Ethereum.EthereumSDK;
