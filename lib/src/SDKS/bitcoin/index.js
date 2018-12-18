"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
                        const apiUrl = this.networks[network].discovery;
                        const URL = `${apiUrl}/addrs/${addresses.toString()}/utxo`;
                        this.axios.get(URL)
                            .then((r) => {
                            const result = [];
                            if (r.data.length === 0) {
                                // if no transactions have happened, there is no balance on the address.
                                return resolve(result);
                            }
                            r.data.forEach((utxo) => {
                                const u = utxo;
                                u.value = utxo.satoshis;
                                result.push(u);
                            });
                            return resolve(result);
                        });
                    });
                }
                // decodeTx(rawTx: Object,
                //   change: string[],
                //   amount: number,
                //   receiver: string,
                //   wallet: any): Object {
                //   const tx = {
                //     tx: rawTx,
                //   };
                //   // return new Promise((resolve, reject) => {
                //   console.log('hex :', JSON.stringify(rawTx));
                //   const Tx: any = this.bitcoinlib.Transaction.fromHex(JSON.stringify(rawTx));
                //   const transaction = {
                //     change,
                //     receiver,
                //     hash: Tx.getId(),
                //   };
                //   return Tx;
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
                // }
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
            }
            Bitcoin.BitcoinSDK = BitcoinSDK;
        })(Bitcoin = SDKS.Bitcoin || (SDKS.Bitcoin = {}));
    })(SDKS = CryptoWallet.SDKS || (CryptoWallet.SDKS = {}));
})(CryptoWallet || (CryptoWallet = {}));
exports.default = CryptoWallet.SDKS.Bitcoin.BitcoinSDK;
