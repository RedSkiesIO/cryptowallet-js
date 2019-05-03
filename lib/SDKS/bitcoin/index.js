var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import * as Coinselect from 'coinselect';
import * as CoinSelectSplit from 'coinselect/split';
import GenericSDK from '../GenericSDK';
export var CryptoWallet;
(function (CryptoWallet) {
    var SDKS;
    (function (SDKS) {
        var Bitcoin;
        (function (Bitcoin) {
            var BitcoinSDK = /** @class */ (function (_super) {
                __extends(BitcoinSDK, _super);
                function BitcoinSDK() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * generates a segwit address
                 * @param keyPair
                 */
                BitcoinSDK.prototype.generateSegWitAddress = function (keyPair) {
                    if (!keyPair.network || !keyPair.network.connect) {
                        throw new Error('Invalid keypair type');
                    }
                    var key = this.bitcoinlib.ECPair.fromWIF(keyPair.privateKey, keyPair.network.connect);
                    var address = this.bitcoinlib.payments.p2wpkh({
                        pubkey: key.publicKey,
                        network: keyPair.network.connect,
                    }).address;
                    return address;
                };
                /**
                 * generates a segwit P2SH address
                 * @param keyPair
                 */
                BitcoinSDK.prototype.generateSegWitP2SH = function (keyPair) {
                    if (!keyPair.network || !keyPair.network.connect) {
                        throw new Error('Invalid keypair type');
                    }
                    var key = this.bitcoinlib.ECPair.fromWIF(keyPair.privateKey, keyPair.network.connect);
                    var address = this.bitcoinlib.payments.p2sh({
                        redeem: this.bitcoinlib.payments.p2wpkh({
                            pubkey: key.publicKey,
                            network: keyPair.network.connect,
                        }),
                        network: keyPair.network.connect,
                    }).address;
                    return address;
                };
                /**
                 * generates a 3 0f 4 multisig segwit address
                 * @param key1
                 * @param key2
                 * @param key3
                 * @param key4
                 * @param network
                 */
                BitcoinSDK.prototype.generateSegWit3of4MultiSigAddress = function (key1, key2, key3, key4, network) {
                    if (!this.networks[network] || !this.networks[network].connect) {
                        throw new Error('Invalid network');
                    }
                    try {
                        var pubkeys = [key1, key2, key3, key4].map(function (hex) { return Buffer.from(hex, 'hex'); });
                        var address = this.bitcoinlib.payments.p2wsh({
                            redeem: this.bitcoinlib.payments.p2ms({
                                pubkeys: pubkeys,
                                m: 3,
                                network: this.networks[network].connect,
                            }),
                            network: this.networks[network].connect,
                        }).address;
                        return address;
                    }
                    catch (e) {
                        throw new Error('Invalid public key used');
                    }
                };
                /**
                 *  generates a P2SH multisig keypair
                 * @param keys
                 * @param network
                 */
                BitcoinSDK.prototype.generateP2SHMultiSig = function (keys, network) {
                    if (!this.networks[network] || !this.networks[network].connect) {
                        throw new Error('Invalid network');
                    }
                    try {
                        var pubkeys = keys.map(function (hex) { return Buffer.from(hex, 'hex'); });
                        var address = this.bitcoinlib.payments.p2sh({
                            redeem: this.bitcoinlib.payments.p2wsh({
                                redeem: this.bitcoinlib.payments.p2ms({
                                    pubkeys: pubkeys,
                                    m: pubkeys.length,
                                    network: this.networks[network].connect,
                                }),
                                network: this.networks[network].connect,
                            }),
                            network: this.networks[network].connect,
                        }).address;
                        return address;
                    }
                    catch (e) {
                        throw new Error('Invalid public key used');
                    }
                };
                /**
                 *  gets the unspent transactions for an array of addresses
                 * @param addresses
                 * @param network
                 */
                BitcoinSDK.prototype.getUTXOs = function (addresses, network) {
                    var _this = this;
                    if (!this.networks[network] || !this.networks[network].connect) {
                        throw new Error('Invalid network');
                    }
                    var validAddress = function (address) { return _this.validateAddress(address, network); };
                    if (!addresses.every(validAddress)) {
                        throw new Error('Invalid address used');
                    }
                    return new Promise(function (resolve, reject) {
                        var apiUrl = _this.networks[network].discovery;
                        var URL = apiUrl + "/addrs/" + addresses.toString() + "/utxo";
                        _this.axios.get(URL)
                            .then(function (r) {
                            var result = [];
                            if (r.data.length === 0) {
                                // if no transactions have happened, there is no balance on the address.
                                return resolve(result);
                            }
                            r.data.forEach(function (utxo) {
                                var u = utxo;
                                u.value = utxo.satoshis;
                                result.push(u);
                            });
                            return resolve(result);
                        })
                            .catch(function (error) { return reject(new Error('Failed to fetch UTXOs')); });
                    });
                };
                /**
                 * creates a transaction with multiple receivers
                 * @param accounts
                 * @param change
                 * @param utxos
                 * @param wallet
                 * @param toAddresses
                 * @param amounts
                 * @param minerRate
                 */
                BitcoinSDK.prototype.createTxToMany = function (accounts, change, utxos, wallet, toAddresses, amounts, minerRate) {
                    var _this = this;
                    if (!wallet.network || !wallet.network.connect) {
                        throw new Error('Invalid wallet type');
                    }
                    var reducer = function (accumulator, currentValue) { return accumulator + currentValue; };
                    var feeRate = minerRate;
                    var amount = amounts.reduce(reducer);
                    var satoshisMultiplier = 100000000;
                    var transactionAmount = Math.floor((amount * satoshisMultiplier));
                    var net = this.networks[wallet.network.name];
                    var rawTx;
                    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var balance, i, targets_1, createTargets, result, inputs_1, inputs_2, outputs, fee, accountsUsed_1, p2shUsed_1, changeInputUsed_1, txb_1, i_1, senders_1, convertMsToS, transaction, spentInput;
                        var _this = this;
                        return __generator(this, function (_a) {
                            if (utxos.length === 0) {
                                return [2 /*return*/, reject(new Error("You don't have enough balance to cover transaction"))];
                            }
                            balance = 0;
                            for (i = 0; i < utxos.length; i += 1) {
                                balance += utxos[i].value;
                            }
                            if ((balance - transactionAmount - feeRate) > 0) {
                                targets_1 = [];
                                createTargets = function (address, index) {
                                    var target = {
                                        address: address,
                                        value: Math.floor(amounts[index] * satoshisMultiplier),
                                    };
                                    targets_1.push(target);
                                };
                                toAddresses.forEach(createTargets);
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
                                outputs.forEach(function (output) {
                                    var address = output.address;
                                    if (!output.address) {
                                        (address = change[0]);
                                    }
                                    txb_1.addOutput(address, output.value);
                                });
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
                                inputs_2.forEach(function (input) {
                                    senders_1.push(input.address);
                                });
                                fee /= satoshisMultiplier;
                                convertMsToS = 1000;
                                transaction = {
                                    fee: fee,
                                    change: change,
                                    receiver: [toAddresses],
                                    confirmed: false,
                                    confirmations: 0,
                                    hash: txb_1.build().getId(),
                                    blockHeight: -1,
                                    sent: true,
                                    value: amount,
                                    sender: senders_1,
                                    receivedTime: new Date().getTime() / convertMsToS,
                                    confirmedTime: undefined,
                                };
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
                 *
                 * @param keypair
                 * @param txHash
                 * @param txNumber
                 * @param address
                 * @param amount
                 */
                BitcoinSDK.prototype.create1t1tx = function (keypair, txHash, txNumber, txValue, address, amount) {
                    if (!keypair.network || !keypair.network.connect) {
                        throw new Error('Invalid keypair');
                    }
                    var key = this.bitcoinlib.ECPair.fromWIF(keypair.privateKey, keypair.network.connect);
                    var p2wpkh = this.bitcoinlib.payments.p2wpkh({ pubkey: key.publicKey, network: keypair.network.connect });
                    var p2sh = this.bitcoinlib.payments.p2sh({ redeem: p2wpkh, network: keypair.network.connect });
                    var txb = new this.bitcoinlib.TransactionBuilder(keypair.network.connect);
                    txb.setVersion(1);
                    txb.addInput(txHash, txNumber);
                    txb.addOutput(address, amount);
                    if (keypair.network.segwit) {
                        txb.sign(0, key, p2sh.redeem.output, undefined, txValue);
                    }
                    else {
                        txb.sign(0, key);
                    }
                    return txb.build().toHex();
                };
                /**
                 *
                 * @param txparams
                 */
                BitcoinSDK.prototype.create2t2tx = function (keypair1, keypair2, utxo1, utxo2, output1, output2) {
                    if (!keypair1.network
                        || !keypair1.network.connect
                        || !keypair2.network
                        || !keypair2.network.connect) {
                        throw new Error('Invalid keypair');
                    }
                    var key1 = this.bitcoinlib.ECPair.fromWIF(keypair1.privateKey, keypair1.network.connect);
                    var key2 = this.bitcoinlib.ECPair.fromWIF(keypair2.privateKey, keypair2.network.connect);
                    var p2wpkh1 = this.bitcoinlib.payments.p2wpkh({ pubkey: key1.publicKey, network: keypair1.network.connect });
                    var p2wpkh2 = this.bitcoinlib.payments.p2wpkh({ pubkey: key2.publicKey, network: keypair2.network.connect });
                    var p2sh1 = this.bitcoinlib.payments.p2sh({ redeem: p2wpkh1, network: keypair1.network.connect });
                    var p2sh2 = this.bitcoinlib.payments.p2sh({ redeem: p2wpkh2, network: keypair2.network.connect });
                    var txb = new this.bitcoinlib.TransactionBuilder(keypair1.network.connect);
                    txb.setVersion(1);
                    txb.addInput(utxo1.txid, utxo1.vout);
                    txb.addInput(utxo2.txid, utxo2.vout);
                    txb.addOutput(output1.address, output1.amount);
                    txb.addOutput(output2.address, output2.amount);
                    if (keypair1.network.segwit) {
                        txb.sign(0, key1, p2sh1.redeem.output, undefined, output1.amount);
                    }
                    else {
                        txb.sign(0, key1);
                    }
                    if (keypair2.network.segwit) {
                        txb.sign(1, key2, p2sh2.redeem.output, undefined, output2.amount);
                    }
                    else {
                        txb.sign(1, key2);
                    }
                    return txb.build().toHex();
                };
                return BitcoinSDK;
            }(GenericSDK));
            Bitcoin.BitcoinSDK = BitcoinSDK;
        })(Bitcoin = SDKS.Bitcoin || (SDKS.Bitcoin = {}));
    })(SDKS = CryptoWallet.SDKS || (CryptoWallet.SDKS = {}));
})(CryptoWallet || (CryptoWallet = {}));
export default CryptoWallet.SDKS.Bitcoin.BitcoinSDK;
