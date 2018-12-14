"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-unresolved */
// eslint-disable-next-line spaced-comment
///<reference path="../../types/module.d.ts" />
const BitcoinLib = require("bitcoinjs-lib");
const Coinselect = require("coinselect");
const CoinSelectSplit = require("coinselect/split");
const Request = require("request");
const Explorers = require("bitcore-explorers");
const GenericSDK_1 = require("../GenericSDK");
var CryptoWallet;
(function (CryptoWallet) {
    var SDKS;
    (function (SDKS) {
        var Bitcoin;
        (function (Bitcoin) {
            class BitcoinSDK extends GenericSDK_1.default {
                constructor() {
                    super(...arguments);
                    this.Explore = Explorers;
                    this.Req = Request;
                }
                /**
                *
                * @param wallet
                * @param index
                * @param external
                */
                generateKeyPair(wallet, index, internal) {
                    let node = wallet.externalNode;
                    if (internal) {
                        node = wallet.internalNode;
                    }
                    const addrNode = node.deriveChild(index);
                    let result = this.bitcoinlib.payments.p2sh({
                        redeem: this.bitcoinlib.payments.p2wpkh({
                            pubkey: addrNode.publicKey,
                            network: wallet.network.connect,
                        }),
                        network: wallet.network.connect,
                    });
                    if (wallet.bip === 44) {
                        result = this.bitcoinlib.payments.p2pkh({
                            pubkey: addrNode.publicKey, network: wallet.network.connect,
                        });
                    }
                    const { address } = result;
                    const keypair = {
                        address,
                        publicKey: addrNode.publicKey.toString('hex'),
                        privateKey: this.wif.encode(wallet.network.connect.wif, addrNode.privateKey, true),
                        derivationPath: `m/${wallet.bip}'/${wallet.type}'/0'/0/${index}`,
                        type: wallet.network.name,
                        network: wallet.network,
                        change: internal,
                    };
                    return keypair;
                }
                /**
                 *
                 * @param keyPair
                 */
                generateSegWitAddress(keyPair) {
                    const key = this.bitcoinlib.ECPair.fromWIF(keyPair.privateKey, keyPair.network.connect);
                    const { address } = this.bitcoinlib.payments.p2wpkh({
                        pubkey: key.publicKey,
                        network: keyPair.network.connect,
                    });
                    return address;
                }
                /**
                 *
                 * @param keyPair
                 */
                generateSegWitP2SH(keyPair) {
                    const key = this.bitcoinlib.ECPair.fromWIF(keyPair.privateKey, keyPair.network.connect);
                    return this.bitcoinlib.payments.p2sh({
                        redeem: this.bitcoinlib.payments.p2wpkh({
                            pubkey: key.publicKey,
                            network: keyPair.network.connect,
                        }),
                        network: keyPair.network.connect,
                    });
                }
                /**
                 *
                 * @param key1
                 * @param key2
                 * @param key3
                 * @param key4
                 */
                // generateSegWit3of4MultiSigAddress(
                // key1: string, key2: string, key3: string, key4: string): Object {
                //   const pubkeys: Array<any> = [key1, key2, key3, key4].map((hex) => Buffer.from(hex, 'hex'));
                //   return this.bitcoinlib.payments.p2wsh({
                //     redeem: this.bitcoinlib.payments.p2ms({ pubkeys, m: 3 }),
                //   });
                // }
                /**
                 *
                 * @param wif
                 */
                importWIF(wif, network) {
                    const keyPair = this.bitcoinlib.ECPair.fromWIF(wif, this.networks[network].connect);
                    const { address } = this.bitcoinlib.payments.p2sh({
                        redeem: this.bitcoinlib.payments.p2wpkh({
                            pubkey: keyPair.publicKey,
                            network: this.networks[network].connect,
                        }),
                        network: this.networks[network].connect,
                    });
                    return address;
                }
                /**
                 *
                 * @param keys
                 */
                gernerateP2SHMultiSig(keys) {
                    const pubkeys = keys.map(hex => Buffer.from(hex, 'hex'));
                    return this.bitcoinlib.payments.p2sh({
                        redeem: this.bitcoinlib.payments.p2ms({ pubkeys, m: pubkeys.length }),
                    });
                }
                getUTXOs(addresses, network) {
                    return new Promise((resolve, reject) => {
                        const unit = Explorers.Unit;
                        const insight = new this.Explore.Insight(this.networks[network].discovery, this.networks[network].type);
                        insight.getUnspentUtxos(addresses, (error, utxos) => {
                            if (error) {
                                // any other error
                                return reject(error);
                            }
                            const result = [];
                            if (utxos.length === 0) {
                                // if no transactions have happened, there is no balance on the address.
                                return resolve(result);
                            }
                            utxos.forEach((utxo) => {
                                const u = utxo.toJSON();
                                u.value = utxo.satoshis;
                                result.push(u);
                            });
                            return resolve(result);
                        });
                    });
                }
                /**
                 *
                 * @param keypair
                 * @param toAddress
                 * @param amount
                 */
                createRawTx(accounts, change, utxos, wallet, toAddress, amount) {
                    const unit = Explorers.Unit;
                    const feeRate = 128;
                    const transactionAmount = amount * 100000000;
                    const minerFee = 0.0001 * 100000000;
                    const net = wallet.network;
                    let rawTx;
                    return new Promise(async (resolve, reject) => {
                        if (utxos.length === 0) {
                            // if no transactions have happened, there is no balance on the address.
                            return resolve("1: You don't have enough Satoshis to cover the miner fee.");
                        }
                        // get balance
                        let balance = 0;
                        for (let i = 0; i < utxos.length; i += 1) {
                            balance += utxos[i].value;
                        }
                        // check whether the balance of the address covers the miner fee
                        if ((balance - transactionAmount - minerFee) > 0) {
                            const targets = [{
                                    address: toAddress,
                                    value: transactionAmount,
                                },
                            ];
                            let result = Coinselect(utxos, targets, feeRate);
                            if (change.length > 1) {
                                change.forEach((c) => {
                                    const tar = {
                                        address: c,
                                    };
                                    targets.push(tar);
                                });
                                const { inputs, outputs, fee } = result;
                                result = CoinSelectSplit(inputs, targets, feeRate);
                            }
                            const { inputs, outputs, fees } = result;
                            const accountsUsed = [];
                            const p2shUsed = [];
                            console.log(`Inputs:${inputs}`);
                            inputs.forEach((input) => {
                                accounts.forEach((account) => {
                                    let key;
                                    if (input.address === account.address) {
                                        if (account.change) {
                                            key = this.generateKeyPair(wallet, account.index, true);
                                        }
                                        else {
                                            key = this.generateKeyPair(wallet, account.index);
                                        }
                                        const keyPair = this.bitcoinlib.ECPair.fromWIF(key.privateKey, net.connect);
                                        const p2wpkh = this.bitcoinlib.payments.p2wpkh({ pubkey: keyPair.publicKey, network: net.connect });
                                        const p2sh = this.bitcoinlib.payments.p2sh({ redeem: p2wpkh, network: net.connect });
                                        accountsUsed.push(keyPair);
                                        p2shUsed.push(p2sh);
                                    }
                                });
                            });
                            const txb = new BitcoinLib.TransactionBuilder(net.connect);
                            txb.setVersion(1);
                            inputs.forEach((input) => {
                                txb.addInput(input.txid, input.vout);
                            });
                            outputs.forEach((output) => {
                                let { address } = output;
                                if (!output.address) {
                                    ([address] = change);
                                }
                                txb.addOutput(address, output.value);
                            });
                            let i = 0;
                            inputs.forEach((input) => {
                                txb.sign(i, accountsUsed[i], p2shUsed[i].redeem.output, undefined, inputs[i].value);
                                i += 1;
                            });
                            rawTx = txb.build().toHex();
                            const senders = [];
                            inputs.forEach((input) => {
                                const inputAddr = input.addresses;
                                inputAddr.forEach((addr) => {
                                    senders.push(addr);
                                });
                            });
                            const transaction = {
                                change,
                                receiver: toAddress,
                                confirmed: false,
                                confirmations: 0,
                                hash: txb.build().getId(),
                                blockHeight: undefined,
                                fee: fees,
                                sent: true,
                                value: amount,
                                sender: senders,
                                receivedTime: undefined,
                                confirmedTime: undefined,
                            };
                            const spentInput = inputs;
                            return resolve({
                                transaction,
                                hexTx: rawTx,
                                utxo: spentInput,
                            });
                        }
                        return resolve("You don't have enough Satoshis to cover the miner fee.");
                    });
                }
                broadcastTx(rawTx, network) {
                    return new Promise((resolve, reject) => {
                        Request.post(this.networks[network].apiUrl, {
                            form: {
                                tx_hex: rawTx,
                            },
                        }, (error, body, result) => {
                            if (error) {
                                return resolve(new Error(`Transaction failed: ${error}`));
                            }
                            const output = JSON.parse(result);
                            const res = output.data.txid;
                            return resolve(res);
                        });
                    });
                }
                decodeTx(rawTx, change, amount, receiver, wallet) {
                    const tx = {
                        tx: rawTx,
                    };
                    // return new Promise((resolve, reject) => {
                    console.log('hex :', JSON.stringify(rawTx));
                    const Tx = this.bitcoinlib.Transaction.fromHex(JSON.stringify(rawTx));
                    const transaction = {
                        change,
                        receiver,
                        hash: Tx.getId(),
                    };
                    return Tx;
                    // this.Req.post(
                    //   {
                    //     url: wallet.network.decodeTxApi,
                    //     form: JSON.stringify(tx),
                    //   },
                    //   (error: any, body: any, result: any) => {
                    //     if (error) {
                    //       return reject(new Error(`Transaction failed: ${error}`));
                    //     }
                    //     const output = JSON.parse(result);
                    //     let confirmed = false;
                    //     if (output.confirmations > 5) { confirmed = true; }
                    //     const senders: any = [];
                    //     output.inputs.forEach((input: any) => {
                    //       const inputAddr = input.addresses;
                    //       inputAddr.forEach((addr: any) => {
                    //         senders.push(addr);
                    //       });
                    //     });
                    //     const transaction = {
                    //       change,
                    //       receiver,
                    //       confirmed,
                    //       confirmations: output.confirmations,
                    //       hash: output.hash,
                    //       blockHeight: output.block_height,
                    //       fee: output.fees,
                    //       sent: true,
                    //       value: amount,
                    //       sender: senders,
                    //       receivedTime: output.received,
                    //       confirmedTime: output.confirmed,
                    //     };
                    //     return resolve(transaction);
                    //   },
                    // );
                    // });
                }
                /**
                 *
                 * @param transaction
                 */
                verifyTxSignature(transaction) {
                    const keyPairs = transaction.pubKeys.map((q) => this.bitcoinlib.ECPair.fromPublicKey(Buffer.from(q, 'hex')));
                    const tx = this.bitcoinlib.Transaction.fromHex(transaction.txHex);
                    const valid = [];
                    tx.ins.forEach((input, i) => {
                        const keyPair = keyPairs[i];
                        const p2pkh = this.bitcoinlib.payments.p2pkh({
                            pubkey: keyPair.publicKey,
                            input: input.script,
                        });
                        const ss = this.bitcoinlib.script.signature.decode(p2pkh.signature);
                        const hash = tx.hashForSignature(i, p2pkh.output, ss.hashType);
                        valid.push(hash === ss.signature);
                    });
                    return valid.every(item => item === true);
                }
                /**
                 *
                 */
                create1t1tx(keypair, txHash, txNumber, address, amount) {
                    const txb = new this.bitcoinlib.TransactionBuilder();
                    txb.setVersion(1);
                    txb.addInput(txHash, txNumber);
                    txb.addOutput(address, amount);
                    txb.sign(0, keypair);
                    return txb.build().toHex();
                }
                /**
                 *
                 */
                create2t2tx(txparams) {
                    const txb = new this.bitcoinlib.TransactionBuilder();
                    txb.setVersion(1);
                    txb.addInput(txparams.txHash1, txparams.txNumber1);
                    txb.addInput(txparams.txHash2, txparams.txNumber2);
                    txb.addOutput(txparams.address1, txparams.amount1);
                    txb.addOutput(txparams.address2, txparams.amount2);
                    txb.sign(0, txparams.keypair1);
                    txb.sign(1, txparams.keypair2);
                    return txb.build().toHex();
                }
                accountDiscovery(entropy, network, internal) {
                    const wallet = this.generateHDWallet(entropy, network);
                    const insight = new Explorers.Insight(wallet.network.discovery, wallet.network.type);
                    let usedAddresses = [];
                    const emptyAddresses = [];
                    let change = false;
                    if (internal) {
                        change = true;
                    }
                    function checkAddress(address, i) {
                        return new Promise(async (resolve, reject) => {
                            await insight.address(address, (err, addr) => {
                                if (err) {
                                    return reject(new Error(err));
                                }
                                const result = {
                                    address: addr.address.toString(),
                                    received: addr.totalReceived,
                                    balance: addr.balance,
                                    index: i,
                                };
                                if (result.received > 0) {
                                    usedAddresses.push(result);
                                }
                                else {
                                    emptyAddresses.push(result.index);
                                }
                                return resolve(result);
                            });
                        });
                    }
                    return new Promise(async (resolve, reject) => {
                        let startIndex = 0;
                        const discover = async () => {
                            const promises = [];
                            for (let i = startIndex; i < startIndex + 20; i += 1) {
                                const number = i;
                                const keypair = this.generateKeyPair(wallet, number, internal);
                                promises.push(new Promise(async (res, rej) => res(checkAddress(keypair.address, number))));
                            }
                            await Promise.all(promises);
                            if (emptyAddresses.length > 0) {
                                const min = Math.min(...emptyAddresses);
                                startIndex = min;
                            }
                            if (emptyAddresses.length <= 20) {
                                discover();
                            }
                        };
                        await discover();
                        if (internal) {
                            usedAddresses = usedAddresses.filter((item) => {
                                if (item.balance === 0)
                                    return false;
                                return true;
                            });
                        }
                        const result = {
                            change,
                            used: usedAddresses,
                            nextAddress: startIndex,
                        };
                        return resolve(result);
                    });
                }
            }
            Bitcoin.BitcoinSDK = BitcoinSDK;
        })(Bitcoin = SDKS.Bitcoin || (SDKS.Bitcoin = {}));
    })(SDKS = CryptoWallet.SDKS || (CryptoWallet.SDKS = {}));
})(CryptoWallet || (CryptoWallet = {}));
exports.default = CryptoWallet.SDKS.Bitcoin.BitcoinSDK;
