"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
///<reference path="../../types/module.d.ts" />
const GenericSDK_1 = require("../GenericSDK");
const BitcoinLib = require("bitcoinjs-lib");
const Bitcore = require("bitcore-lib");
const Coinselect = require("coinselect");
const Request = require("request");
const Explorers = require("bitcore-explorers");
var CryptoWallet;
(function (CryptoWallet) {
    var SDKS;
    (function (SDKS) {
        var Bitcoin;
        (function (Bitcoin) {
            class BitcoinSDK extends GenericSDK_1.default {
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
                    const { address } = this.bitcoinlib.payments.p2sh({
                        redeem: this.bitcoinlib.payments.p2wpkh({ pubkey: addrNode.publicKey, network: wallet.network.connect }),
                        network: wallet.network.connect
                    });
                    const keypair = {
                        publicKey: addrNode.publicKey.toString('hex'),
                        address: address,
                        privateKey: this.wif.encode(wallet.network.connect.wif, addrNode.privateKey, true),
                        derivationPath: `m/49'/${wallet.type}'/0'/0/${index}`,
                        type: wallet.network.name,
                        network: wallet.network,
                        change: internal
                    };
                    return keypair;
                }
                /**
                 *
                 * @param keyPair
                 */
                generateSegWitAddress(keyPair) {
                    return this.bitcoinlib.payments.p2wpkh({ pubkey: keyPair.publicKey, network: keyPair.network });
                }
                /**
                 *
                 * @param keyPair
                 */
                generateSegWitP2SH(keyPair) {
                    return this.bitcoinlib.payments.p2sh({
                        redeem: this.bitcoinlib.payments.p2wpkh({ pubkey: keyPair.publicKey, network: keyPair.network })
                    });
                }
                /**
                 *
                 * @param key1
                 * @param key2
                 * @param key3
                 * @param key4
                 */
                generateSegWit3of4MultiSigAddress(key1, key2, key3, key4) {
                    const pubkeys = [key1, key2, key3, key4].map((hex) => Buffer.from(hex, 'hex'));
                    return this.bitcoinlib.payments.p2wsh({
                        redeem: this.bitcoinlib.payments.p2ms({ m: 3, pubkeys })
                    });
                }
                /**
                 *
                 * @param wif
                 */
                importWIF(wif) {
                    const keyPair = this.bitcoinlib.ECPair.fromWIF(wif);
                    const { address } = this.bitcoinlib.payments.p2sh({
                        redeem: this.bitcoinlib.payments.p2wpkh({ pubkey: keyPair.publicKey })
                    });
                    return address;
                }
                /**
                 *
                 * @param keys
                 */
                gernerateP2SHMultiSig(keys) {
                    const pubkeys = keys.map((hex) => Buffer.from(hex, 'hex'));
                    return this.bitcoinlib.payments.p2sh({
                        redeem: this.bitcoinlib.payments.p2ms({ m: pubkeys.length, pubkeys })
                    });
                }
                /**
                 *
                 * @param keypair
                 * @param toAddress
                 * @param amount
                 */
                createRawTx(keypair, toAddress, amount) {
                    const unit = Bitcore.Unit;
                    const feeRate = 128;
                    const transactionAmount = unit.fromBTC(amount).toSatoshis();
                    const minerFee = unit.fromMilis(0.128).toSatoshis();
                    const apiUrl = keypair.network.apiUrl;
                    let rawTx;
                    const keyPair = BitcoinLib.ECPair.fromWIF(keypair.privateKey, keypair.network.connect);
                    return new Promise((resolve, reject) => {
                        Request.get(apiUrl + keypair.address, (error, req, body) => {
                            if (error) {
                                // any other error
                                return reject(error);
                            }
                            else {
                                const result = JSON.parse(body);
                                const utxos = result.data.txs;
                                if (utxos.length === 0) {
                                    // if no transactions have happened, there is no balance on the address.
                                    return reject("You don't have enough Satoshis to cover the miner fee.");
                                }
                                // get balance
                                let balance = unit.fromBTC(0).toSatoshis();
                                for (var i = 0; i < utxos.length; i++) {
                                    balance += unit.fromBTC(utxos[i]['value']).toSatoshis();
                                }
                                // check whether the balance of the address covers the miner fee
                                if ((balance - transactionAmount - minerFee) > 0) {
                                    const jsonUtxos = [];
                                    utxos.forEach((utxo) => {
                                        const jsonUtxo = utxo;
                                        jsonUtxo.value = unit.fromBTC(utxo.value).toSatoshis();
                                        jsonUtxo.vout = utxo.output_no;
                                        jsonUtxos.push(jsonUtxo);
                                    });
                                    const targets = [{
                                            address: toAddress,
                                            value: transactionAmount
                                        }];
                                    const { inputs, outputs, fee } = Coinselect(jsonUtxos, targets, feeRate);
                                    const txb = new BitcoinLib.TransactionBuilder(keypair.network.connect);
                                    const p2wpkh = this.bitcoinlib.payments.p2wpkh({ pubkey: keyPair.publicKey, network: keypair.network.connect });
                                    const p2sh = this.bitcoinlib.payments.p2sh({ redeem: p2wpkh, network: keypair.network.connect });
                                    txb.setVersion(1);
                                    inputs.forEach((input) => {
                                        txb.addInput(input.txid, input.vout);
                                    });
                                    outputs.forEach((output) => {
                                        if (!output.address) {
                                            output.address = keypair.address;
                                        }
                                        txb.addOutput(output.address, output.value);
                                    });
                                    inputs.forEach((input) => {
                                        let i = 0;
                                        txb.sign(i, keyPair, p2sh.redeem.output, undefined, inputs[i].value);
                                        i++;
                                    });
                                    rawTx = txb.build().toHex();
                                    console.log(rawTx);
                                    return resolve(rawTx);
                                }
                                else {
                                    return reject("You don't have enough Satoshis to cover the miner fee.");
                                }
                            }
                        });
                    });
                }
                broadcastTx(rawTx, network) {
                    const tx = {
                        tx: rawTx
                    };
                    return new Promise((resolve, reject) => {
                        Request.post({ url: this.networks[network].sendTxApi, form: JSON.stringify(tx) }, function (error, body, result) {
                            if (error) {
                                return reject('Transaction failed: ' + error);
                            }
                            const output = JSON.parse(result);
                            result = output.tx.hash;
                            return resolve(result);
                        });
                    });
                }
                // createRawTx(keypair: any, toAddress: string, amount: number): Object {
                //   return new Promise((resolve, reject) => {
                //     const fromAddress = keypair.address;
                //     console.log(fromAddress)
                //     const unit = Bitcore.Unit;
                //     const insight = new Explorers.Insight('https://test-insight.bitpay.com', 'testnet');
                //     const minerFee = unit.fromMilis(0.128).toSatoshis(); //cost of transaction in satoshis (minerfee)
                //     const transactionAmount = unit.fromMilis(amount).toSatoshis(); //convert mBTC to Satoshis using bitcore unit
                //     // if (!Bitcoinaddress.validate(fromAddress)) {
                //     //   return reject('Origin address checksum failed');
                //     // }
                //     // if (!Bitcoinaddress.validate(toAddress)) {
                //     //   return reject('Recipient address checksum failed');
                //     // }
                //     insight.getUnspentUtxos(fromAddress, function (error: string, utxos: any) {
                //       if (error) {
                //         //any other error
                //         console.log(error);
                //         return reject('1:' + error);
                //       } else {
                //         console.log(utxos)
                //         if (utxos.length == 0) {
                //           //if no transactions have happened, there is no balance on the address.
                //           return reject("You don't have enough Satoshis to cover the miner fee.");
                //         }
                //         //get balance
                //         let balance = unit.fromSatoshis(0).toSatoshis();
                //         for (var i = 0; i < utxos.length; i++) {
                //           balance += unit.fromSatoshis(parseInt(utxos[i]['satoshis'])).toSatoshis();
                //         }
                //         //check whether the balance of the address covers the miner fee
                //         if ((balance - transactionAmount - minerFee) > 0) {
                //           //create a new transaction
                //           try {
                //             let bitcore_transaction: any = new Bitcore.Transaction()
                //               .from(utxos)
                //               .to(toAddress, transactionAmount)
                //               .fee(minerFee)
                //               .change(fromAddress)
                //               .sign(keypair.privateKey);
                //             return bitcore_transaction.serialize()
                //             //handle serialization errors
                //             // if (bitcore_transaction.getSerializationError()) {
                //             //   let error = bitcore_transaction.getSerializationError().message;
                //             //   switch (error) {
                //             //     case 'Some inputs have not been fully signed':
                //             //       return reject('Please check your private key');
                //             //       break;
                //             //     default:
                //             //     //return reject('2:' + error);
                //             //   }
                //             // }
                //             // broadcast the transaction to the blockchain
                //             // insight.broadcast(bitcore_transaction, function (error: string, body: any) {
                //             //   if (error) {
                //             //     reject('Error in broadcast: ' + error);
                //             //   } else {
                //             //     resolve({
                //             //       transactionId: body
                //             //     });
                //             //   }
                //             // });
                //             resolve({
                //               bitcore_transaction
                //             })
                //           } catch (error) {
                //             return reject('3:' + error);
                //           }
                //         } else {
                //           return reject("You don't have enough Satoshis to cover the miner fee.");
                //         }
                //       }
                //     });
                //   });
                // }
                /**
                 *
                 * @param transaction
                 */
                verifyTxSignature(transaction) {
                    const keyPairs = transaction.pubKeys.map((q) => {
                        return this.bitcoinlib.ECPair.fromPublicKey(Buffer.from(q, 'hex'));
                    });
                    const tx = this.bitcoinlib.Transaction.fromHex(transaction.txHex);
                    const valid = [];
                    tx.ins.forEach((input, i) => {
                        const keyPair = keyPairs[i];
                        const p2pkh = this.bitcoinlib.payments.p2pkh({
                            pubkey: keyPair.publicKey,
                            input: input.script
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
                    const BITCORE_URL = 'https://testnet.blockexplorer.com/';
                    const insight = new Explorers.Insight('https://testnet.blockexplorer.com', 'testnet');
                    let usedAddresses = [];
                    let emptyAddresses = [];
                    let change = false;
                    if (internal) {
                        change = true;
                    }
                    function checkAddress(address, i) {
                        return new Promise(async (resolve, reject) => {
                            await insight.address(address, function (err, address) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    const result = {
                                        address: address.address.toString(),
                                        received: address.totalReceived,
                                        balance: address.balance,
                                        index: i
                                    };
                                    if (result.received > 0) {
                                        usedAddresses.push(result);
                                    }
                                    else {
                                        emptyAddresses.push(result.index);
                                    }
                                    return resolve(result);
                                }
                            });
                        });
                    }
                    return new Promise(async (resolve, reject) => {
                        let discover = true;
                        let startIndex = 0;
                        while (discover) {
                            let promises = [];
                            for (let i = startIndex; i < startIndex + 20; i++) {
                                const keypair = this.generateKeyPair(wallet, i, internal);
                                promises.push(new Promise(async (resolve, reject) => {
                                    return resolve(checkAddress(keypair.address, i));
                                }));
                            }
                            await Promise.all(promises);
                            if (emptyAddresses.length > 0) {
                                const min = Math.min(...emptyAddresses);
                                startIndex = min;
                            }
                            if (emptyAddresses.length > 20) {
                                discover = false;
                            }
                        }
                        if (internal) {
                            usedAddresses.forEach((address) => {
                                if (address.balance === 0) {
                                    usedAddresses.pull(address);
                                }
                            });
                        }
                        const result = {
                            used: usedAddresses,
                            nextAddress: startIndex,
                            change: change
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
