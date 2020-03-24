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
            class CatalystSDK extends GenericSDK {
                constructor() {
                    super(...arguments);
                    this.ethereumlib = EthereumLib;
                    this.Web3 = Web3;
                    this.bip39 = Bip39;
                    this.walletHdpath = 'm/44\'/42069\'/';
                }
                generateHDWallet(entropy, network) {
                    if (!this.bip39.validateMnemonic(entropy)) {
                        throw new TypeError('Invalid entropy');
                    }
                    const seed = this.bip39.mnemonicToSeedHex(entropy);
                    return {
                        ext: seed,
                        int: null,
                        bip: 44,
                        type: 42069,
                        network: network,
                    };
                }
                ;
                /**
                 * generate an ethereum keypair using a HD wallet object
                 * @param wallet
                 * @param index
                 */
                generateKeyPair(wallet, index) {
                    if (!wallet.network || wallet.network.connect) {
                        throw new Error('Invalid wallet type');
                    }
                    const data = derivePath(`${this.walletHdpath + index}'`, wallet.ext);
                    const wal = CatalystWallet.generateFromSeed(data.key);
                    const keypair = {
                        publicKey: wal.getPublicKeyString(),
                        address: wal.getAddressString(),
                        derivationPath: `${this.walletHdpath + index}'`,
                        privateKey: wal.getPrivateKeyString(),
                        type: 'Catalyst',
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
                    const data = derivePath(`${this.walletHdpath + index}'`, wallet.ext);
                    const wal = CatalystWallet.generateFromSeed(data.key);
                    const address = {
                        index,
                        address: wal.getAddressString(),
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
                    const web3 = new this.Web3(keypair.network.provider);
                    return new Promise(async (resolve, reject) => {
                        const nonce = await web3.eth.getTransactionCount(keypair.address);
                        const sendAmount = amount.toString();
                        const gasAmount = gasPrice.toString();
                        const gasLimit = 21000;
                        const tx = new CatalystTx({
                            nonce,
                            gasPrice: web3.utils.toHex(gasAmount),
                            gasLimit: web3.utils.toHex(gasLimit),
                            to: toAddress,
                            value: web3.utils.toHex(web3.utils.toWei(sendAmount)),
                            data: '0x0',
                        });
                        await tx.sign(keypair.privateKey);
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
                    const rpc = new ERPC({
                        transport: {
                            host: '77.68.110.194',
                            port: 5005,
                            type: 'http',
                            path: '/api/eth/request',
                        },
                    });
                    const getBlocks = async (from, to, erpc) => {
                        const promises = [];
                        for (let i = from; i <= to; i += 1) {
                            promises.push(erpc.eth_getBlockByNumber(`0x${i.toString(16)}`, true));
                        }
                        return Promise.all(promises);
                    };
                    const getTxs = async (txHashes, erpc) => {
                        const promises = [];
                        txHashes.forEach((hash) => {
                            promises.push(erpc.eth_getTransactionByHash(hash));
                        });
                        const txs = Promise.all(promises);
                        console.log(txs);
                        return txs;
                    };
                    const fetchTxs = async (address) => {
                        const txHashes = [];
                        const txTimestamps = {};
                        let min = startBlock;
                        let max = endBlock;
                        if (!endBlock) {
                            const height = await rpc.eth_blockNumber();
                            min = parseInt(height, 16) - 100;
                            max = parseInt(height, 16);
                        }
                        const blocks = await getBlocks(min, max, rpc);
                        blocks.forEach(({ transactions, timestamp }) => {
                            console.log(transactions);
                            if (transactions.length > 0) {
                                txHashes.push(...transactions);
                                transactions.forEach((tx) => {
                                    txTimestamps[tx] = timestamp;
                                });
                            }
                            ;
                        });
                        const txs = await getTxs(txHashes, rpc);
                        return txs.reduce((filtered, tx) => {
                            if (tx.from === addresses[0] || tx.to === address) {
                                tx.timestamp = txTimestamps[tx.hash];
                                filtered.push(tx);
                            }
                            return filtered;
                        }, []);
                    };
                    const transactions = [];
                    const minConfirmations = 1;
                    const weiMultiplier = 1000000000000000000;
                    const gweiMultiplier = 1000000000;
                    const getHistory = async (address) => {
                        const txs = await fetchTxs(address);
                        txs.forEach((r) => {
                            let receiver = r.to;
                            let sent = false;
                            let confirmed = false;
                            let contractCall = false;
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
                            const transaction = {
                                sent,
                                receiver,
                                contractCall,
                                confirmed,
                                hash: r.hash,
                                blockHeight: parseInt(r.blockNumber, 16),
                                fee: (parseInt(r.gas, 16) * parseInt(r.gasLimit, 16) / gweiMultiplier).toString(),
                                value: parseInt(r.value, 16) / weiMultiplier,
                                sender: r.from,
                                receivedTime: parseInt(r.timestamp, 16),
                                confirmedTime: parseInt(r.timestamp, 16),
                                confirmations: 1,
                            };
                            transactions.push(transaction);
                        });
                    };
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
                    const rpc = new ERPC({
                        transport: {
                            host: '77.68.110.194',
                            port: 5005,
                            type: 'http',
                            path: '/api/eth/request',
                        },
                    });
                    let balance = 0;
                    const promises = [];
                    const weiMultiplier = 1000000000000000000;
                    const getAddrBalance = (addr) => new Promise(async (resolve, reject) => {
                        const bal = await rpc.eth_getBalance(addr);
                        resolve(bal ? (parseInt(bal, 16) / weiMultiplier) : 0);
                    });
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
            Catalyst.CatalystSDK = CatalystSDK;
        })(Catalyst = SDKS.Catalyst || (SDKS.Catalyst = {}));
    })(SDKS = CryptoWallet.SDKS || (CryptoWallet.SDKS = {}));
})(CryptoWallet || (CryptoWallet = {}));
export default CryptoWallet.SDKS.Catalyst.CatalystSDK;
