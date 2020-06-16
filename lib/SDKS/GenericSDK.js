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
<<<<<<< HEAD
        class GenericSDK {
            constructor(network) {
=======
        var GenericSDK = /** @class */ (function () {
            function GenericSDK(network) {
>>>>>>> develop
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
<<<<<<< HEAD
            generateHDWallet(entropy, net) {
                if (!this.bip39.validateMnemonic(entropy)) {
                    throw new TypeError('Invalid entropy');
                }
                const network = this.networkInfo ? this.networkInfo : this.networks[net];
                if (!network) {
                    throw new Error('Invalid network');
                }
                const cointype = network.bip;
=======
            GenericSDK.prototype.generateHDWallet = function (entropy, net) {
                if (!this.bip39.validateMnemonic(entropy)) {
                    throw new TypeError('Invalid entropy');
                }
                var network = this.networkInfo ? this.networkInfo : this.networks[net];
                if (!network) {
                    throw new Error('Invalid network');
                }
                var cointype = network.bip;
>>>>>>> develop
                // root of node tree
                const root = Bip44hdkey.fromMasterSeed(this.bip39.mnemonicToSeed(entropy));
                let externalNode;
                let internalNode;
                let bip = 0;
                const segWitBip = 49;
                const nonSegWitBip = 44;
                // check if coin type supports segwit
                if (network.segwit) {
<<<<<<< HEAD
                    externalNode = root.derive(`m/49'/${cointype}'/0'/0`);
                    internalNode = root.derive(`m/49'/${cointype}'/0'/1`); // for change addresses
=======
                    externalNode = root.derive("m/49'/" + cointype + "'/0'/0");
                    internalNode = root.derive("m/49'/" + cointype + "'/0'/1"); // for change addresses
>>>>>>> develop
                    bip = segWitBip;
                }
                else if (network.name === 'REGTEST') {
                    externalNode = root.derive('m/0');
                    internalNode = root.derive('m/1');
                    bip = 0;
                }
                else {
                    externalNode = root.derive(`m/44'/${cointype}'/0'/0`);
                    internalNode = root.derive(`m/44'/${cointype}'/0'/1`); // for change addresses
                    bip = nonSegWitBip;
                }
                const wallet = {
                    bip,
                    ext: externalNode.toJSON(),
                    int: internalNode.toJSON(),
                    type: cointype,
                    network: network,
                };
                return wallet;
            }
            /**
            * This method creates a keypair from a wallet object and a given index
            * @param wallet
            * @param index
            * @param internal
            */
            generateKeyPair(wallet, index, internal) {
                if (!wallet.network.connect) {
                    throw new Error('Invalid wallet type');
                }
                let node = Bip44hdkey.fromJSON(wallet.ext);
                if (internal) {
                    node = Bip44hdkey.fromJSON(wallet.int);
                }
                const addrNode = node.deriveChild(index);
                let result = this.bitcoinlib.payments.p2sh({
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
            * This method generates an address from a wallet object and a given index.
            * @param wallet
            * @param index
            * @param external
            */
            generateAddress(wallet, index, internal) {
                if (!wallet.network.connect) {
                    throw new Error('Invalid wallet type');
                }
                let node = Bip44hdkey.fromJSON(wallet.ext);
                if (internal) {
                    node = Bip44hdkey.fromJSON(wallet.int);
                }
                const addrNode = node.deriveChild(index);
                let result = this.bitcoinlib.payments.p2sh({
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
                const { address } = result;
                const addr = {
                    address,
                    index,
                    type: wallet.network.name,
                    change: internal,
                };
                return addr;
            }
            /**
             *  Restore  a keypair using a WIF
             * @param wif
             * @param network
             */
<<<<<<< HEAD
            importWIF(wif, net) {
                const network = this.networkInfo ? this.networkInfo : this.networks[net];
                if (!network || !network.connect) {
                    throw new Error('Invalid network type');
                }
                const keyPair = this.bitcoinlib.ECPair.fromWIF(wif, network.connect);
                let result = this.bitcoinlib.payments.p2sh({
=======
            GenericSDK.prototype.importWIF = function (wif, net) {
                var network = this.networkInfo ? this.networkInfo : this.networks[net];
                if (!network || !network.connect) {
                    throw new Error('Invalid network type');
                }
                var keyPair = this.bitcoinlib.ECPair.fromWIF(wif, network.connect);
                var result = this.bitcoinlib.payments.p2sh({
>>>>>>> develop
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
                const { address } = result;
                return {
                    address,
                    keyPair,
                };
            }
            /**
             * broadcasts a transaction
             * @param tx
             * @param network
             */
<<<<<<< HEAD
            broadcastTx(tx, net) {
                const network = this.networkInfo ? this.networkInfo : this.networks[net];
                if (!network || !network.connect) {
                    throw new Error('Invalid network type');
                }
                return new Promise((resolve, reject) => {
                    if (network.segwit) {
                        this.axios.post(network.broadcastUrl, { tx_hex: tx })
                            .then((r) => {
                            const res = r.data.data.txid;
=======
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
>>>>>>> develop
                            return resolve(res);
                        })
                            .catch((e) => reject(new Error('Transaction failed')));
                    }
                    else {
<<<<<<< HEAD
                        this.axios.post(`${network.discovery}/tx/send`, { rawtx: tx })
                            .then((r) => {
                            const { txid } = r.data;
=======
                        _this.axios.post(network.discovery + "/tx/send", { rawtx: tx })
                            .then(function (r) {
                            var txid = r.data.txid;
>>>>>>> develop
                            return resolve(txid);
                        })
                            .catch((e) => reject(new Error('Transaction failed')));
                    }
                });
            }
            /**
             * validates an address
             * @param address
             * @param network
             */
<<<<<<< HEAD
            validateAddress(address, net) {
                const network = this.networkInfo ? this.networkInfo : this.networks[net];
=======
            GenericSDK.prototype.validateAddress = function (address, net) {
                var network = this.networkInfo ? this.networkInfo : this.networks[net];
>>>>>>> develop
                try {
                    this.bitcoinlib.address.toOutputScript(address, network.connect);
                }
                catch (e) {
                    return false;
                }
                return true;
            }
            /**
             * gets the estimated cost of a transaction
             * TODO: only works for bitcoin currently
             * @param network
             */
<<<<<<< HEAD
            getTransactionFee(net) {
                const network = this.networkInfo ? this.networkInfo : this.networks[net];
                if (!network || !network.connect) {
                    throw new Error('Invalid network type');
                }
                return new Promise((resolve, reject) => {
                    const URL = network.feeApi;
                    const kbToBytes = 1000;
                    this.axios.get(URL)
                        .then((r) => {
=======
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
>>>>>>> develop
                        resolve({
                            high: r.data.high_fee_per_kb / kbToBytes,
                            medium: r.data.medium_fee_per_kb / kbToBytes,
                            low: r.data.low_fee_per_kb / kbToBytes,
                        });
                    })
                        .catch((error) => reject(error.message));
                });
            }
            /**
            * returns a transaction object that contains the raw transaction hex
            * @param keypair
            * @param toAddress
            * @param amount
            */
            createRawTx(accounts, change, utxos, wallet, toAddress, amount, minerRate, max) {
                if (!wallet || !wallet.network || !wallet.network.connect) {
                    throw new Error('Invalid wallet type');
                }
                if (!this.validateAddress(toAddress, wallet.network.name)) {
                    throw new Error(`Invalid to address "${toAddress}"`);
                }
                const feeRate = minerRate;
                const satoshisMultiplier = 100000000;
                const transactionAmount = Math.floor((amount * satoshisMultiplier));
                const net = wallet.network;
                let rawTx;
                return new Promise(async (resolve, reject) => {
                    if (utxos.length === 0) {
                        // if no transactions have happened, there is no balance on the address.
                        return reject(new Error("You don't have enough balance to cover transaction"));
                    }
                    // get balance
                    let balance = 0;
                    for (let i = 0; i < utxos.length; i += 1) {
                        balance += utxos[i].value;
                    }
                    // check whether the balance of the address covers the miner fee
                    if ((balance - transactionAmount) > 0) {
                        let targets = [{
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
                            const { inputs } = result;
                            result = CoinSelectSplit(inputs, targets, feeRate);
                        }
                        if (max) {
                            targets = [{
                                    address: toAddress,
                                }];
                            result = CoinSelectSplit(utxos, targets, feeRate);
                        }
                        const { inputs, outputs } = result;
                        let { fee } = result;
                        const accountsUsed = [];
                        const p2shUsed = [];
                        const changeInputUsed = [];
                        inputs.forEach((input) => {
                            accounts.forEach((account) => {
                                let key;
                                if (input.address === account.address) {
                                    if (account.change) {
                                        key = this.generateKeyPair(wallet, account.index, true);
                                        changeInputUsed.push(account);
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
                        const txb = new this.bitcoinlib.TransactionBuilder(net.connect);
                        txb.setVersion(1);
                        inputs.forEach((input) => {
                            txb.addInput(input.txid, input.vout);
                        });
                        let maxValue = 0;
                        if (max) {
                            outputs.forEach((output) => {
                                maxValue += output.value;
                            });
                            txb.addOutput(toAddress, maxValue);
                        }
                        else {
                            outputs.forEach((output) => {
                                let { address } = output;
                                if (!output.address) {
                                    ([address] = change);
                                }
                                txb.addOutput(address, output.value);
                            });
                        }
                        let i = 0;
                        inputs.forEach((input) => {
                            if (wallet.network.segwit) {
                                txb.sign(i, accountsUsed[i], p2shUsed[i].redeem.output, undefined, inputs[i].value);
                            }
                            else {
                                txb.sign(i, accountsUsed[i]);
                            }
                            i += 1;
                        });
                        rawTx = txb.build().toHex();
                        const senders = [];
                        const convertMstoS = 1000;
                        const txInputs = inputs.map((input) => {
                            senders.push(input.address);
                            return input.txid;
                        });
                        fee /= satoshisMultiplier;
                        const transaction = {
                            fee,
                            change,
                            receiver: [toAddress],
                            confirmed: false,
                            inputs: txInputs,
                            confirmations: 0,
                            hash: txb.build().getId(),
                            blockHeight: -1,
                            sent: true,
                            value: amount,
                            sender: senders,
                            receivedTime: new Date().getTime() / convertMstoS,
                            confirmedTime: undefined,
                        };
                        if (max) {
                            transaction.value = maxValue / satoshisMultiplier;
                        }
                        const spentInput = inputs;
                        return resolve({
                            changeInputUsed,
                            transaction,
                            hexTx: rawTx,
                            utxo: spentInput,
                        });
                    }
                    return reject(new Error("You don't have enough Satoshis to cover the miner fee."));
                });
            }
            /**
            * verifies the signatures of a transaction object
            * @param transaction
            */
<<<<<<< HEAD
            verifyTxSignature(transaction, net) {
                const network = this.networkInfo ? this.networkInfo : this.networks[net];
                if (!network || !network.connect) {
                    throw new Error('Invalid network type');
                }
                const keyPairs = transaction.pubKeys.map((q) => this.bitcoinlib.ECPair.fromPublicKey(Buffer.from(q, 'hex'), network.connect));
                const tx = this.bitcoinlib.Transaction.fromHex(transaction.txHex);
                const valid = [];
                tx.ins.forEach((input, i) => {
                    const keyPair = keyPairs[i];
                    const p2pkh = this.bitcoinlib.payments.p2pkh({
=======
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
>>>>>>> develop
                        pubkey: keyPair.publicKey,
                        input: input.script,
                    });
                    const ss = this.bitcoinlib.script.signature.decode(p2pkh.signature);
                    const hash = tx.hashForSignature(i, p2pkh.output, ss.hashType);
                    valid.push(keyPair.verify(hash, ss.signature));
                });
                return valid.every(item => item === true);
            }
            /**
             * This method discovers the addresses which have previously been used in a wallet
             * @param entropy
             * @param network
             * @param internal
             */
            accountDiscovery(wallet, internal) {
                if (!wallet || !wallet.network || !wallet.network.connect) {
                    throw new Error('Invalid wallet type');
                }
<<<<<<< HEAD
                const apiUrl = wallet.network.discovery;
                let usedAddresses = [];
                const usedAddressesIndex = [];
                let emptyAddresses = [];
                let change = false;
=======
                var apiUrl = wallet.network.discovery;
                var usedAddresses = [];
                var usedAddressesIndex = [];
                var emptyAddresses = [];
                var change = false;
>>>>>>> develop
                if (internal) {
                    change = true;
                }
                const checkAddress = (address, i) => {
                    const URL = `${apiUrl}/addr/${address}?noTxList=1`;
                    return new Promise(async (resolve, reject) => {
                        try {
                            const addr = await this.axios.get(URL);
                            if (!addr.data) {
                                return reject(new Error('API ERROR'));
                            }
                            const result = {
                                address,
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
                            return resolve(result);
                        }
                        catch (err) {
                            return reject(err);
                        }
                    });
                };
                return new Promise(async (resolve, reject) => {
                    let startIndex = 0;
                    const discover = async () => {
                        const promises = [];
                        const gapLimit = 20;
                        for (let i = startIndex; i < startIndex + gapLimit; i += 1) {
                            const number = i;
                            const keypair = this.generateKeyPair(wallet, number, internal);
                            promises.push(checkAddress(keypair.address, number));
                        }
                        try {
                            await Promise.all(promises);
                        }
                        catch (err) {
                            throw err;
                        }
                        if (emptyAddresses.length > 0) {
                            if (usedAddressesIndex.length > 0) {
                                const max = Math.max(...usedAddressesIndex) + 1;
                                startIndex = max;
                            }
                        }
                        if (emptyAddresses.length < gapLimit) {
                            emptyAddresses = [];
                            await discover();
                        }
                    };
                    try {
                        await discover();
                    }
                    catch (e) {
                        return reject(e);
                    }
                    const result = {
                        change,
                        nextAddress: startIndex,
                    };
                    const allAddresses = usedAddresses;
                    if (internal) {
                        result.used = allAddresses;
                        usedAddresses = usedAddresses.filter((item) => {
                            if (item.balance === 0)
                                return false;
                            return true;
                        });
                    }
                    result.active = usedAddresses;
                    return resolve(result);
                });
            }
            /**
             * gets the transaction history for an array of addresses
             * @param addresses
             * @param network
             * @param from
             * @param to
             */
<<<<<<< HEAD
            getTransactionHistory(addresses, net, from, to) {
                const network = this.networkInfo ? this.networkInfo : this.networks[net];
                if (!network || !network.connect) {
                    throw new Error('Invalid network');
                }
                const validAddress = (address) => this.validateAddress(address, net);
                if (!addresses.every(validAddress)) {
                    throw new Error('Invalid address used');
                }
                return new Promise((resolve, reject) => {
                    const apiUrl = network.discovery;
                    const URL = `${apiUrl}/addrs/txs`;
                    this.axios.post(URL, {
=======
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
>>>>>>> develop
                        addrs: addresses.toString(),
                        from,
                        to,
                    })
                        .then((r) => {
                        if (r.data.totalItems === 0) {
                            return resolve();
                        }
                        let more = false;
                        if (r.data.totalItems > to) {
                            more = true;
                        }
                        const results = r.data.items;
                        const transactions = [];
                        const minConfirmations = 5;
                        results.forEach((result) => {
                            let confirmed = false;
                            if (result.confirmations > minConfirmations) {
                                confirmed = true;
                            }
                            let sent = false;
                            let value = 0;
                            const change = [];
                            const receivers = [];
                            const senders = [];
                            const inputs = [];
                            result.vin.forEach((input) => {
                                if (addresses.includes(input.addr)) {
                                    sent = true;
                                }
                                senders.push(input.addr);
                                inputs.push(input.txid);
                            });
                            result.vout.forEach((output) => {
                                const outputAddr = output.scriptPubKey.addresses;
                                const v = parseFloat(output.value);
                                outputAddr.forEach((addr) => {
                                    const ad = addr[0];
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
                            const transaction = {
                                sent,
                                value,
                                change,
                                confirmed,
                                inputs,
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
                        const history = {
                            more,
                            from,
                            to,
                            address: addresses,
                            totalTransactions: r.data.totalItems,
                            txs: transactions,
                        };
                        return resolve(history);
                    })
                        .catch((error) => reject(new Error('API failed to get transaction history')));
                });
            }
            /**
             * gets the total balance of an array of addresses
             * @param addresses
             * @param network
             */
<<<<<<< HEAD
            getBalance(addresses, net) {
                const network = this.networkInfo ? this.networkInfo : this.networks[net];
                if (!network || !network.connect) {
                    throw new Error('Invalid network');
                }
                const validAddress = (address) => this.validateAddress(address, net);
                if (!addresses.every(validAddress)) {
                    throw new Error('Invalid address used');
                }
                return new Promise((resolve, reject) => {
                    let balance = 0;
                    const apiUrl = network.discovery;
                    const URL = `${apiUrl}/addrs/utxo`;
                    this.axios.post(URL, {
=======
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
>>>>>>> develop
                        addrs: addresses.toString(),
                    })
                        .then((r) => {
                        if (r.data.length === 0) {
                            balance = 0;
                            return resolve(balance);
                        }
                        r.data.forEach((utxo) => {
                            balance += utxo.amount;
                        });
                        return resolve(balance);
                    })
                        .catch((error) => reject(new Error('API failed to return a balance')));
                });
            }
        }
        SDKS.GenericSDK = GenericSDK;
    })(SDKS = CryptoWallet.SDKS || (CryptoWallet.SDKS = {}));
})(CryptoWallet || (CryptoWallet = {}));
export default CryptoWallet.SDKS.GenericSDK;
