"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-unresolved */
// eslint-disable-next-line spaced-comment
/// <reference path="../../types/module.d.ts" />
const Bip39 = require("bip39");
const Bip44hdkey = require("hdkey");
const Bitcoinlib = require("bitcoinjs-lib");
const Wif = require("wif");
const Request = require("request");
const Axios = require("axios");
const Coinselect = require("coinselect");
const CoinSelectSplit = require("coinselect/split");
const Networks = require("./networks");
var CryptoWallet;
(function (CryptoWallet) {
    var SDKS;
    (function (SDKS) {
        class GenericSDK {
            constructor() {
                this.bitcoinlib = Bitcoinlib;
                this.networks = Networks;
                this.bip39 = Bip39;
                this.wif = Wif;
                this.request = Request;
                this.axios = Axios;
            }
            /**
             * generates an hierarchical determinitsic wallet for a given coin type
             * @param entropy
             * @param network
             */
            generateHDWallet(entropy, network) {
                if (!this.bip39.validateMnemonic(entropy)) {
                    throw new TypeError('Invalid entropy');
                }
                if (!this.networks[network]) {
                    throw new TypeError('Invalid network');
                }
                const cointype = this.networks[network].bip;
                // root of node tree
                const root = Bip44hdkey.fromMasterSeed(this.bip39.mnemonicToSeed(entropy));
                let externalNode;
                let internalNode;
                let bip;
                // check if coin type supports segwit
                if (this.networks[network].segwit) {
                    externalNode = root.derive(`m/49'/${cointype}'/0'/0`);
                    internalNode = root.derive(`m/49'/${cointype}'/0'/1`); // for change addresses
                    bip = 49;
                }
                else if (this.networks[network].name === 'REGTEST') {
                    externalNode = root.derive('m/0');
                    internalNode = root.derive('m/1');
                }
                else {
                    externalNode = root.derive(`m/44'/${cointype}'/0'/0`);
                    internalNode = root.derive(`m/44'/${cointype}'/0'/1`); // for change addresses
                    bip = 44;
                }
                const wallet = {
                    externalNode,
                    internalNode,
                    bip,
                    mnemonic: entropy,
                    privateKey: root.privateExtendedKey,
                    type: cointype,
                    network: this.networks[network],
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
            importWIF(wif, network) {
                if (!this.networks[network].connect) {
                    throw new Error('Invalid network type');
                }
                const keyPair = this.bitcoinlib.ECPair.fromWIF(wif, this.networks[network].connect);
                let result = this.bitcoinlib.payments.p2sh({
                    redeem: this.bitcoinlib.payments.p2wpkh({
                        pubkey: keyPair.publicKey,
                        network: this.networks[network].connect,
                    }),
                    network: this.networks[network].connect,
                });
                if (!this.networks[network].segwit) {
                    result = this.bitcoinlib.payments.p2pkh({
                        pubkey: keyPair.publicKey, network: this.networks[network].connect,
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
            broadcastTx(tx, network) {
                return new Promise((resolve, reject) => {
                    if (!this.networks[network].connect) {
                        throw new Error('Invalid network type');
                    }
                    if (this.networks[network].segwit) {
                        Request.post(this.networks[network].broadcastUrl, {
                            form: {
                                tx_hex: tx,
                            },
                        }, (error, body, result) => {
                            if (error) {
                                return reject(new Error(`Transaction failed: ${error}`));
                            }
                            console.log('result :', result);
                            const output = JSON.parse(result);
                            const res = output.data.txid;
                            return resolve(res);
                        });
                    }
                    else {
                        Request.post(`${this.networks[network].discovery}/tx/send`, {
                            form: {
                                rawtx: tx,
                            },
                        }, (error, body, result) => {
                            if (error) {
                                return reject(new Error(`Transaction failed: ${error}`));
                            }
                            console.log('result :', result);
                            try {
                                const res = JSON.parse(result);
                                const { txid } = res;
                                return resolve(txid);
                            }
                            catch (err) {
                                return reject(new Error(result));
                            }
                        });
                    }
                });
            }
            /**
             * validates an address
             * @param address
             * @param network
             */
            validateAddress(address, network) {
                try {
                    this.bitcoinlib.address.toOutputScript(address, this.networks[network].connect);
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
            getTransactionFee(network) {
                return new Promise((resolve, reject) => {
                    if (!this.networks[network].connect) {
                        throw new Error('Invalid network type');
                    }
                    const URL = this.networks[network].feeApi;
                    this.axios.get(URL)
                        .then((r) => resolve({
                        high: r.data.high_fee_per_kb / 1000,
                        medium: r.data.medium_fee_per_kb / 1000,
                        low: r.data.low_fee_per_kb / 1000,
                    }))
                        .catch((error) => reject(new Error(error)));
                });
            }
            /**
            * returns a transaction object that contains the raw transaction hex
            * @param keypair
            * @param toAddress
            * @param amount
            */
            createRawTx(accounts, change, utxos, wallet, toAddress, amount, minerRate, max) {
                if (!wallet.network.connect) {
                    throw new Error('Invalid wallet type');
                }
                if (!this.validateAddress(toAddress, wallet.network.name)) {
                    throw new Error('Invalid to address');
                }
                const feeRate = minerRate;
                const transactionAmount = Math.floor((amount * 100000000));
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
                            console.log(targets);
                            result = CoinSelectSplit(utxos, targets, feeRate);
                        }
                        console.log('targets: ', targets);
                        const { inputs, outputs } = result;
                        let { fee } = result;
                        console.log(result);
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
                        inputs.forEach((input) => {
                            senders.push(input.address);
                        });
                        fee /= 100000000;
                        const transaction = {
                            fee,
                            change,
                            receiver: [toAddress],
                            confirmed: false,
                            confirmations: 0,
                            hash: txb.build().getId(),
                            blockHeight: -1,
                            sent: true,
                            value: amount,
                            sender: senders,
                            receivedTime: new Date().getTime() / 1000,
                            confirmedTime: undefined,
                        };
                        if (max) {
                            transaction.value = maxValue / 100000000;
                        }
                        console.log(outputs);
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
            verifyTxSignature(transaction, network) {
                if (!this.networks[network].connect) {
                    throw new Error('Invalid network type');
                }
                const keyPairs = transaction.pubKeys.map((q) => this.bitcoinlib.ECPair.fromPublicKey(Buffer.from(q, 'hex'), this.networks[network].connect));
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
             * This method discovers the addresses which have previously been used in a wallet
             * @param entropy
             * @param network
             * @param internal
             */
            accountDiscovery(entropy, network, internal) {
                const wallet = this.generateHDWallet(entropy, network);
                const apiUrl = wallet.network.discovery;
                let usedAddresses = [];
                const emptyAddresses = [];
                let change = false;
                if (internal) {
                    change = true;
                }
                const checkAddress = (address, i) => {
                    const URL = `${apiUrl}/addr/${address}?noTxList=1`;
                    return new Promise(async (resolve, reject) => {
                        console.log('URL :', URL);
                        this.axios.get(URL)
                            .then((addr) => {
                            const result = {
                                address,
                                received: addr.data.totalReceived,
                                balance: addr.data.balance,
                                index: i,
                            };
                            if (result.received > 0) {
                                usedAddresses.push(result);
                            }
                            else {
                                emptyAddresses.push(result.index);
                            }
                            return resolve(result);
                        })
                            .catch((error) => reject(new Error(error)));
                    });
                };
                return new Promise(async (resolve, reject) => {
                    if (!this.networks[network].connect) {
                        return reject(new Error('Invalid network type'));
                    }
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
            getTransactionHistory(addresses, network, from, to) {
                return new Promise((resolve, reject) => {
                    if (!this.networks[network].connect) {
                        return reject(new Error('Invalid network type'));
                    }
                    const validAddress = (address) => this.validateAddress(address, network);
                    if (!addresses.every(validAddress)) {
                        return reject(new Error('Invalid address used'));
                    }
                    const apiUrl = this.networks[network].discovery;
                    const URL = `${apiUrl}/addrs/${addresses.toString()}/txs?from=${from}&to=${to}`;
                    this.axios.get(URL)
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
                        results.forEach((result) => {
                            let confirmed = false;
                            if (result.confirmations > 5) {
                                confirmed = true;
                            }
                            let sent = false;
                            let value = 0;
                            let change = 0;
                            const receivers = [];
                            const senders = [];
                            result.vin.forEach((input) => {
                                if (addresses.includes(input.addr)) {
                                    sent = true;
                                }
                                senders.push(input.addr);
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
                                        change += parseFloat(output.value);
                                    }
                                });
                            });
                            const transaction = {
                                sent,
                                value,
                                change,
                                confirmed,
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
                        .catch((error) => reject(error));
                });
            }
            /**
             * gets the total balance of an array of addresses
             * @param addresses
             * @param network
             */
            getBalance(addresses, network) {
                return new Promise((resolve, reject) => {
                    if (!this.networks[network]) {
                        return reject(new Error('Invalid network'));
                    }
                    if (!this.networks[network].connect) {
                        return reject(new Error('Invalid network type'));
                    }
                    const validAddress = (address) => this.validateAddress(address, network);
                    if (!addresses.every(validAddress)) {
                        return reject(new Error('Invalid address used'));
                    }
                    let balance = 0;
                    const apiUrl = this.networks[network].discovery;
                    const URL = `${apiUrl}/addrs/${addresses.toString()}/utxo`;
                    this.axios.get(URL)
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
                        .catch((error) => reject(new Error(error)));
                });
            }
            getPriceFeed(coins, currencies) {
                const URL = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${coins.toString()}&tsyms=${currencies.toString()}&api_key=${this.networks.cryptocompare}`;
                return new Promise((resolve, reject) => {
                    this.axios.get(URL)
                        .then((r) => resolve(r.data.DISPLAY))
                        .catch((error) => reject(new Error(error)));
                });
            }
            getHistoricalData(coin, currency, period) {
                return new Promise((resolve, reject) => {
                    let time;
                    if (period === 'day') {
                        time = 24;
                    }
                    else if (period === 'week') {
                        time = 168;
                    }
                    else if (period === 'month') {
                        time = 31;
                    }
                    else {
                        return reject(new Error('Invalid Period'));
                    }
                    const URL = `https://min-api.cryptocompare.com/data/histohour?fsym=${coin}&tsym=${currency}&limit=${time}&api_key=${this.networks.cryptocompare}`;
                    this.axios.get(URL)
                        .then((r) => {
                        const data = r.data.Data;
                        if (!data) {
                            return reject(new Error('No price data found'));
                        }
                        const dataset = data.map((x) => ({
                            t: x.time * 1000,
                            y: x.close,
                        }));
                        return resolve(dataset);
                    })
                        .catch((error) => reject(new Error(error)));
                });
            }
        }
        SDKS.GenericSDK = GenericSDK;
    })(SDKS = CryptoWallet.SDKS || (CryptoWallet.SDKS = {}));
})(CryptoWallet = exports.CryptoWallet || (exports.CryptoWallet = {}));
exports.default = CryptoWallet.SDKS.GenericSDK;
