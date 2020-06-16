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
<<<<<<< HEAD
            class ERC20SDK {
                constructor(api) {
=======
            var ERC20SDK = /** @class */ (function () {
                function ERC20SDK(api) {
>>>>>>> develop
                    this.json = ERC20JSON;
                    this.networks = Networks;
                    this.axios = Axios;
                    this.Tx = EthereumTx;
                    this.Web3 = Web3;
                    if (api)
                        this.api = api;
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
<<<<<<< HEAD
                generateERC20Wallet(keypair, tokenName, tokenSymbol, contractAddress, decimals) {
                    const valid = this.Web3.utils.isAddress(contractAddress.toLowerCase());
=======
                ERC20SDK.prototype.generateERC20Wallet = function (keypair, tokenName, tokenSymbol, contractAddress, decimals) {
                    var valid = this.Web3.utils.isAddress(contractAddress.toLowerCase());
>>>>>>> develop
                    if (!valid) {
                        throw new Error('This is not a valid ERC20 contract address');
                    }
                    return {
                        decimals,
                        address: keypair.address,
                        network: keypair.network,
                        name: tokenName,
                        type: keypair.type,
                        symbol: tokenSymbol,
                        contract: contractAddress,
                    };
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
                ERC20SDK.prototype.broadcastTx = function (rawTx, network) {
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
<<<<<<< HEAD
                    });
                }
                estimateGas(erc20Wallet, to, amount, network) {
                    const provider = this.api ? this.api.provider : this.networks[network].provider;
                    const web3 = new this.Web3(provider);
                    const contract = new web3.eth.Contract(this.json, erc20Wallet.contract);
                    const sendAmount = (amount * (10 ** erc20Wallet.decimals)).toString();
                    return new Promise(async (resolve, reject) => {
                        contract.methods.transfer(to, sendAmount).estimateGas({ from: erc20Wallet.address }, (error, gasUsed) => {
                            if (error)
                                return reject(error);
                            return resolve(gasUsed);
=======
                    }); });
                };
                ERC20SDK.prototype.estimateGas = function (erc20Wallet, to, amount, network) {
                    var _this = this;
                    var provider = this.api ? this.api.provider : this.networks[network].provider;
                    var web3 = new this.Web3(provider);
                    var contract = new web3.eth.Contract(this.json, erc20Wallet.contract);
                    var sendAmount = (amount * (Math.pow(10, erc20Wallet.decimals))).toString();
                    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            contract.methods.transfer(to, sendAmount).estimateGas({ from: erc20Wallet.address }, function (error, gasUsed) {
                                if (error)
                                    return reject(error);
                                return resolve(gasUsed);
                            });
                            return [2 /*return*/];
>>>>>>> develop
                        });
                    });
                }
                /**
                 * Create a transaction that transafers ERC20 tokens to a give address
                 * @param erc20Wallet
                 * @param to
                 * @param amount
                 */
                transfer(erc20Wallet, keypair, to, amount, gasPrice) {
                    const web3 = new this.Web3(erc20Wallet.network.provider);
                    const contract = new web3.eth.Contract(this.json, erc20Wallet.contract);
                    const sendAmount = (amount * (10 ** erc20Wallet.decimals)).toString();
                    const method = contract.methods.transfer(to, sendAmount).encodeABI();
                    return this.createTx(erc20Wallet, keypair, method, gasPrice, to, amount);
                }
                /**
                 * Create a transaction that approves another account to transfer ERC20 tokens
                 * @param erc20Wallet
                 * @param to
                 * @param amount
                 */
                approveAccount(erc20Wallet, keypair, to, amount, gasPrice) {
                    const web3 = new this.Web3(erc20Wallet.network.provider);
                    const contract = new web3.eth.Contract(this.json, erc20Wallet.contract);
                    const sendAmount = (amount * (10 ** erc20Wallet.decimals)).toString();
                    const method = contract.methods.approve(to, sendAmount).encodeABI();
                    return this.createTx(erc20Wallet, keypair, method, gasPrice);
                }
                /**
                 * Create a transaction that transfers money from another account
                 * @param erc20Wallet
                 * @param from
                 * @param amount
                 */
                transferAllowance(erc20Wallet, keypair, from, amount, gasPrice) {
                    return new Promise(async (resolve, reject) => {
                        const web3 = new this.Web3(erc20Wallet.network.provider);
                        const contract = new web3.eth.Contract(this.json, erc20Wallet.contract);
                        const check = await this.checkAllowance(erc20Wallet, from);
                        if (check >= amount) {
                            const sendAmount = (amount * (10 ** erc20Wallet.decimals)).toString();
                            const method = contract.methods.transferFrom(from, erc20Wallet.address, sendAmount).encodeABI();
                            const tx = this.createTx(erc20Wallet, keypair, method, gasPrice);
                            return resolve(tx);
                        }
                        return resolve("You don't have enough allowance");
                    });
                }
                /**
                 * Checks how much can be transfered from another account
                 * @param erc20Wallet
                 * @param from
                 */
                checkAllowance(erc20Wallet, from) {
                    this.wallet = erc20Wallet;
                    return new Promise(async (resolve, reject) => {
                        const web3 = new this.Web3(erc20Wallet.network.provider);
                        const contract = new web3.eth.Contract(this.json, erc20Wallet.contract);
                        const allowance = await contract.methods.allowance(from, erc20Wallet.address).call();
                        return resolve(allowance);
                    });
                }
                /**
                 * Gets the balance of the ERC20 token on a users ethereum account
                 * @param erc20Wallet
                 */
                getBalance(erc20Wallet) {
                    this.wallet = erc20Wallet;
<<<<<<< HEAD
                    return new Promise(async (resolve, reject) => {
                        const provider = this.api ? this.api.provider : erc20Wallet.network.provider;
                        const web3 = new this.Web3(provider);
                        const contract = new web3.eth.Contract(this.json, erc20Wallet.contract);
                        const balance = await contract.methods.balanceOf(erc20Wallet.address).call();
                        const adjustedBalance = balance / (10 ** erc20Wallet.decimals);
                        return resolve(adjustedBalance);
                    });
                }
                getTokenData(address, network) {
                    return new Promise(async (resolve, reject) => {
                        const provider = this.api ? this.api.provider : this.networks[network].provider;
                        const web3 = new this.Web3(provider);
                        const abiArray = this.json;
                        const valid = await web3.eth.getCode(address);
                        if (valid === '0x') {
                            return reject(new Error('This is not a valid ERC20 contract address'));
                        }
                        const contract = new web3.eth.Contract(abiArray, address);
                        await contract.methods.balanceOf('0xcc345035D14458B3C012977f96fA1E116760D60a').call()
                            .catch((error) => reject(new Error('Not a valid ERC20 contract address')));
                        try {
                            const decimals = await contract.methods.decimals().call();
                            const name = await contract.methods.name().call();
                            const symbol = await contract.methods.symbol().call();
                            return resolve({
                                name,
                                symbol,
                                decimals,
                            });
                        }
                        catch (err) {
                            return resolve();
                        }
                    });
                }
=======
                    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var provider, web3, contract, balance, adjustedBalance;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    provider = this.api ? this.api.provider : erc20Wallet.network.provider;
                                    web3 = new this.Web3(provider);
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
                        var provider, web3, abiArray, valid, contract, decimals, name_1, symbol, err_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    provider = this.api ? this.api.provider : this.networks[network].provider;
                                    web3 = new this.Web3(provider);
                                    abiArray = this.json;
                                    return [4 /*yield*/, web3.eth.getCode(address)];
                                case 1:
                                    valid = _a.sent();
                                    if (valid === '0x') {
                                        return [2 /*return*/, reject(new Error('This is not a valid ERC20 contract address'))];
                                    }
                                    contract = new web3.eth.Contract(abiArray, address);
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
>>>>>>> develop
                /**
                 * gets the transaction histroy of the ERC20 token on a users Ethereum account
                 * @param erc20Wallet
                 * @param lastBlock
                 */
<<<<<<< HEAD
                getTransactionHistory(erc20Wallet, startBlock) {
                    return new Promise(async (resolve, reject) => {
                        const apiUrl = this.api ? `${this.api.etherscan}?module=account&action=tokentx&contractaddress=` : this.networks[erc20Wallet.network.name].getErc20TranApi;
                        const apiToken = this.api ? this.api.etherscanKey : this.networks.ethToken;
                        let URL = `${apiUrl + erc20Wallet.contract}&address=${erc20Wallet.address}&startblock=${startBlock}&sort=desc` + (apiToken ? `&apikey=${apiToken}` : null);
                        if (typeof startBlock === 'undefined') {
                            URL = `${apiUrl + erc20Wallet.contract}&address=${erc20Wallet.address}&sort=desc` + (apiToken ? `&apikey=${apiToken}` : null);
                        }
                        await this.axios.get(URL)
                            .then(async (res) => {
                            if (!res.data.result) {
                                return resolve();
=======
                ERC20SDK.prototype.getTransactionHistory = function (erc20Wallet, startBlock) {
                    var _this = this;
                    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var apiUrl, apiToken, URL;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    apiUrl = this.api ? this.api.etherscan + "?module=account&action=tokentx&contractaddress=" : this.networks[erc20Wallet.network.name].getErc20TranApi;
                                    apiToken = this.api ? this.api.etherscanKey : this.networks.ethToken;
                                    URL = apiUrl + erc20Wallet.contract + "&address=" + erc20Wallet.address + "&startblock=" + startBlock + "&sort=desc" + (apiToken ? "&apikey=" + apiToken : null);
                                    if (typeof startBlock === 'undefined') {
                                        URL = apiUrl + erc20Wallet.contract + "&address=" + erc20Wallet.address + "&sort=desc" + (apiToken ? "&apikey=" + apiToken : null);
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
>>>>>>> develop
                            }
                            const transactions = [];
                            const minConfirmations = 11;
                            const convertToEth = 1000000000;
                            res.data.result.forEach((r) => {
                                const receiver = r.to;
                                let sent = false;
                                let confirmed = false;
                                if (r.from === erc20Wallet.address.toLowerCase()) {
                                    sent = true;
                                }
                                if (r.confirmations > minConfirmations) {
                                    confirmed = true;
                                }
                                const transaction = {
                                    sent,
                                    receiver,
                                    confirmed,
                                    hash: r.hash,
                                    blockHeight: r.blockNumber,
                                    fee: r.cumulativeGasUsed / convertToEth,
                                    value: r.value / (10 ** erc20Wallet.decimals),
                                    sender: r.from,
                                    confirmedTime: r.timeStamp,
                                    confirmations: r.confirmations,
                                };
                                transactions.push(transaction);
                            });
                            return resolve(transactions);
                        })
                            .catch((e) => reject(e));
                    });
                }
                /**
                 * Only used internally to create a raw transaction
                 * @param erc20Wallet
                 * @param method
                 */
                createTx(erc20Wallet, keypair, method, gasPrice, to, amount) {
                    const web3 = new this.Web3(erc20Wallet.network.provider);
                    return new Promise(async (resolve, reject) => {
                        const nonce = await web3.eth.getTransactionCount(erc20Wallet.address);
                        const gas = gasPrice.toString();
                        const gasLimit = 100000;
                        let estimatedGas = gasLimit;
                        if (to && amount) {
                            try {
                                estimatedGas = await this.estimateGas(erc20Wallet, to, amount, keypair.network.name);
                            }
                            catch (e) {
                                reject(e);
                            }
                        }
                        const tx = new this.Tx({
                            nonce,
                            gasPrice: web3.utils.toHex(gas),
                            gasLimit: web3.utils.toHex(gasLimit),
                            to: erc20Wallet.contract,
                            value: 0,
                            data: method,
                            chainId: erc20Wallet.network.chainId,
                        });
                        const removePrefix = 2;
                        const privateKey = Buffer.from(keypair.privateKey.substr(removePrefix), 'hex');
                        tx.sign(privateKey);
                        const raw = `0x${tx.serialize().toString('hex')}`;
                        const fee = (gasPrice * estimatedGas).toString();
                        const msToS = 1000;
                        const transaction = {
                            fee,
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
                        return resolve({
                            hexTx: raw,
                            transaction,
                        });
                    });
                }
            }
            ERC20.ERC20SDK = ERC20SDK;
        })(ERC20 = SDKS.ERC20 || (SDKS.ERC20 = {}));
    })(SDKS = CryptoWallet.SDKS || (CryptoWallet.SDKS = {}));
})(CryptoWallet || (CryptoWallet = {}));
export default CryptoWallet.SDKS.ERC20.ERC20SDK;
