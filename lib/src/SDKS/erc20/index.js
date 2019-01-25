"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-unresolved */
// eslint-disable-next-line spaced-comment
///<reference path="../../types/module.d.ts" />
const EthereumTx = require("ethereumjs-tx");
const Web3 = require("web3");
const Axios = require("axios");
const ERC20JSON = require("./erc20");
const Networks = require("../networks");
var CryptoWallet;
(function (CryptoWallet) {
    var SDKS;
    (function (SDKS) {
        var ERC20;
        (function (ERC20) {
            class ERC20SDK {
                constructor() {
                    this.json = ERC20JSON;
                    this.networks = Networks;
                    this.axios = Axios;
                    this.Tx = EthereumTx;
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
                generateERC20Wallet(keypair, tokenName, tokenSymbol, contractAddress, decimals) {
                    const web3 = new Web3(new Web3.providers.HttpProvider(keypair.network.provider));
                    const abiArray = this.json.contract;
                    const contract = new web3.eth.Contract(abiArray, contractAddress);
                    const privateKey = Buffer.from(keypair.privateKey.substr(2), 'hex');
                    return {
                        keypair,
                        address: keypair.address,
                        network: keypair.network,
                        name: tokenName,
                        symbol: tokenSymbol,
                        contract: contractAddress,
                        decimals,
                        web3,
                        contractInstance: contract,
                        privateKey,
                    };
                }
                /**
                 * Only used internally to create a raw transaction
                 * @param erc20Wallet
                 * @param method
                 */
                createTx(erc20Wallet, method, gasPrice, to, amount) {
                    return new Promise((resolve, reject) => {
                        erc20Wallet.web3.eth.getTransactionCount(erc20Wallet.address, (err, nonce) => {
                            if (err) {
                                return reject(err);
                            }
                            const gas = gasPrice.toString();
                            const tx = new this.Tx({
                                nonce,
                                gasPrice: erc20Wallet.web3.utils.toHex(gas),
                                gasLimit: erc20Wallet.web3.utils.toHex(21000),
                                to: erc20Wallet.contract,
                                value: 0,
                                data: method,
                                chainId: erc20Wallet.network.chainId,
                            });
                            tx.sign(erc20Wallet.privateKey);
                            const raw = `0x${tx.serialize().toString('hex')}`;
                            const transaction = {
                                hash: erc20Wallet.web3.utils.sha3(raw),
                                fee: gas,
                                receiver: to,
                                confirmed: false,
                                confirmations: 0,
                                blockHeight: -1,
                                sent: true,
                                value: amount,
                                sender: erc20Wallet.address,
                                receivedTime: new Date().getTime() / 1000,
                                confirmedTime: new Date().getTime() / 1000,
                            };
                            return resolve({
                                hexTx: raw,
                                transaction,
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
                        web3.eth.sendSignedTransaction(rawTx, (err, result) => {
                            if (err)
                                return reject(err);
                            return resolve(result);
                        });
                    });
                }
                /**
                 * Create a transaction that transafers ERC20 tokens to a give address
                 * @param erc20Wallet
                 * @param to
                 * @param amount
                 */
                transfer(erc20Wallet, to, amount, gasPrice) {
                    const sendAmount = (amount * (10 ** erc20Wallet.decimals)).toString();
                    const method = erc20Wallet.contractInstance.methods.transfer(to, sendAmount).encodeABI();
                    return this.createTx(erc20Wallet, method, gasPrice, to, amount);
                }
                /**
                 * Create a transaction that approves another account to transfer ERC20 tokens
                 * @param erc20Wallet
                 * @param to
                 * @param amount
                 */
                approveAccount(erc20Wallet, to, amount, gasPrice) {
                    const sendAmount = (amount * (10 ** erc20Wallet.decimals)).toString();
                    const method = erc20Wallet.contractInstance.methods.approve(to, sendAmount).encodeABI();
                    return this.createTx(erc20Wallet, method, gasPrice);
                }
                /**
                 * Create a transaction that transfers money from another account
                 * @param erc20Wallet
                 * @param from
                 * @param amount
                 */
                transferAllowance(erc20Wallet, from, amount, gasPrice) {
                    return new Promise(async (resolve, reject) => {
                        const check = await this.checkAllowance(erc20Wallet, from);
                        if (check >= amount) {
                            const sendAmount = (amount * (10 ** erc20Wallet.decimals)).toString();
                            const method = erc20Wallet.contractInstance.methods.transferFrom(from, erc20Wallet.address, sendAmount).encodeABI();
                            const tx = this.createTx(erc20Wallet, method, gasPrice);
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
                    this.Wallet = erc20Wallet;
                    return new Promise(async (resolve, reject) => {
                        this.Wallet.contractInstance.methods.allowance(from, erc20Wallet.address).call()
                            .then((result) => resolve(result));
                    });
                }
                /**
                 * Gets the balance of the ERC20 token on a users ethereum account
                 * @param erc20Wallet
                 */
                getBalance(erc20Wallet) {
                    this.Wallet = erc20Wallet;
                    return new Promise(async (resolve, reject) => {
                        this.Wallet.contractInstance.methods.balanceOf(erc20Wallet.address).call()
                            .then((result) => {
                            const balance = result / (10 ** erc20Wallet.decimals);
                            return resolve(balance);
                        });
                    });
                }
                /**
                 * gets the transaction histroy of the ERC20 token on a users Ethereum account
                 * @param erc20Wallet
                 * @param lastBlock
                 */
                getTransactionHistory(erc20Wallet, startBlock) {
                    return new Promise(async (resolve, reject) => {
                        let URL = `${erc20Wallet.network.getErc20TranApi + erc20Wallet.contract}&address=${erc20Wallet.address}&startblock=${startBlock}&sort=desc&apikey=${this.networks.ethToken}`;
                        if (typeof startBlock === 'undefined') {
                            URL = `${erc20Wallet.network.getErc20TranApi + erc20Wallet.contract}&address=${erc20Wallet.address}&sort=desc&apikey=${this.networks.ethToken}`;
                            console.log(URL);
                        }
                        await this.axios.get(URL)
                            .then(async (res) => {
                            if (!res.data.result) {
                                return resolve();
                            }
                            console.log('r.data.result :', res.data.result);
                            const transactions = [];
                            // const nextBlock: number = 0//res.data.result[0].blockNumber
                            res.data.result.forEach((r) => {
                                const receiver = r.to;
                                let sent = false;
                                let confirmed = false;
                                const contractCall = false;
                                if (r.from === erc20Wallet.address.toLowerCase()) {
                                    sent = true;
                                }
                                if (r.confirmations > 11) {
                                    confirmed = true;
                                }
                                const transaction = {
                                    hash: r.hash,
                                    blockHeight: r.blockNumber,
                                    fee: r.cumulativeGasUsed / 1000000000,
                                    sent,
                                    value: r.value / (10 ** erc20Wallet.decimals),
                                    sender: r.from,
                                    receiver,
                                    confirmed,
                                    confirmedTime: r.timeStamp,
                                    confirmations: r.confirmations,
                                };
                                transactions.push(transaction);
                            });
                            return resolve(transactions);
                        });
                    });
                }
            }
            ERC20.ERC20SDK = ERC20SDK;
        })(ERC20 = SDKS.ERC20 || (SDKS.ERC20 = {}));
    })(SDKS = CryptoWallet.SDKS || (CryptoWallet.SDKS = {}));
})(CryptoWallet = exports.CryptoWallet || (exports.CryptoWallet = {}));
exports.default = CryptoWallet.SDKS.ERC20.ERC20SDK;
