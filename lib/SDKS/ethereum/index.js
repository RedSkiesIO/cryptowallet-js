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
            class EthereumSDK extends GenericSDK {
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
                validateAddress(address, network) {
                    const web3 = new this.Web3(this.networks[network].provider);
                    return web3.utils.isAddress(address.toLowerCase());
                }
                /**
                * gets the estimated cost of a transaction
                * TODO: only works for bitcoin currently
                * @param network
                */
                getTransactionFee(network) {
                    if (!this.networks[network] || this.networks[network].connect) {
                        throw new Error('Invalid network');
                    }
                    return new Promise((resolve, reject) => {
                        const URL = this.networks[network].feeApi;
                        const gasLimit = 21000;
                        const weiMultiplier = 1000000000000000000;
                        this.axios.get(URL)
                            .then((r) => resolve({
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
                        const gasLimit = 21000;
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
                broadcastTx(rawTx, network) {
                    const web3 = new this.Web3(this.networks[network].provider);
                    return new Promise(async (resolve, reject) => {
                        const hash = await web3.eth.sendSignedTransaction(rawTx);
                        return resolve({
                            hash,
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
                    const minConfirmations = 11;
                    const weiMultiplier = 1000000000000000000;
                    const gweiMultiplier = 1000000000;
                    const getHistory = (address) => new Promise(async (resolve, reject) => {
                        const URL = `${this.networks[network].getTranApi + address}&startblock=${startBlock}&sort=desc&apikey=${this.networks.ethToken}`;
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
                getBalance(addresses, network) {
                    let balance = 0;
                    const promises = [];
                    const getAddrBalance = (addr) => new Promise(async (resolve, reject) => {
                        const URL = `${this.networks[network].getBalanceApi + addr}&tag=latest&apikey=${this.networks.ethToken}`;
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
