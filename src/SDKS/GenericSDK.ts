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
import axios, * as others from 'axios';
import * as Coinselect from 'coinselect';
import * as CoinSelectSplit from 'coinselect/split';
import {
  Wallet, KeyPair, Address, Transaction, NetworkInfo
} from './GenericSDK.d';
import * as Networks from './networks';
import * as ISDK from './ISDK';


export namespace CryptoWallet.SDKS {

  export abstract class GenericSDK implements ISDK.CryptoWallet.SDKS.ISDK {
    bitcoinlib = Bitcoinlib;
    networks: any = Networks;
    bip39: any = Bip39;
    wif: any = Wif;
    axios: any = axios;
    networkInfo?: NetworkInfo;

    constructor(network?: NetworkInfo) {
      if (network) { this.networkInfo = network }
    }
    

    /**
     * generates an hierarchical determinitsic wallet for a given coin type
     * @param entropy
     * @param network
     */
    generateHDWallet(entropy: string, net: string): Wallet {
      if (!this.bip39.validateMnemonic(entropy)) {
        throw new TypeError('Invalid entropy');
      }
      // if (!this.networks[network]) {
      //   throw new TypeError('Invalid network');
      // }

    const network: NetworkInfo = this.networkInfo ? this.networkInfo : this.networks[net];
      const cointype: number = network.bip;
      // root of node tree
      const root = Bip44hdkey.fromMasterSeed(
        this.bip39.mnemonicToSeed(entropy),
      );
      let externalNode;
      let internalNode;
      let bip = 0;
      const segWitBip = 49;
      const nonSegWitBip = 44;
      // check if coin type supports segwit
      if (network.segwit) {
        externalNode = root.derive(`m/49'/${cointype}'/0'/0`);
        internalNode = root.derive(`m/49'/${cointype}'/0'/1`); // for change addresses
        bip = segWitBip;
      } else if (network.name === 'REGTEST') {
        externalNode = root.derive('m/0');
        internalNode = root.derive('m/1');
        bip = 0;
      } else {
        externalNode = root.derive(`m/44'/${cointype}'/0'/0`);
        internalNode = root.derive(`m/44'/${cointype}'/0'/1`); // for change addresses
        bip = nonSegWitBip;
      }
      const wallet: Wallet = {
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
    generateKeyPair(wallet: Wallet, index: number, internal?: boolean): KeyPair {
      if (!wallet.network.connect) {
        throw new Error('Invalid wallet type');
      }
      let node = Bip44hdkey.fromJSON(wallet.ext);
      if (internal) { node = Bip44hdkey.fromJSON(wallet.int); }
      const addrNode = node.deriveChild(index);

      let result: any = this.bitcoinlib.payments.p2sh({
        redeem: this.bitcoinlib.payments.p2wpkh(
          {
            pubkey: addrNode.publicKey,
            network: wallet.network.connect,
          },
        ),
        network: wallet.network.connect,
      });

      if (!wallet.network.segwit) {
        result = this.bitcoinlib.payments.p2pkh({
          pubkey: addrNode.publicKey, network: wallet.network.connect,
        });
      }

      const { address } = result;
      const keypair: KeyPair = {
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
    generateAddress(
      wallet: Wallet,
      index: number,
      internal?: boolean,
    ): Address {
      if (!wallet.network.connect) {
        throw new Error('Invalid wallet type');
      }
      let node = Bip44hdkey.fromJSON(wallet.ext);
      if (internal) { node = Bip44hdkey.fromJSON(wallet.int); }
      const addrNode = node.deriveChild(index);
      let result: any = this.bitcoinlib.payments.p2sh({
        redeem: this.bitcoinlib.payments.p2wpkh(
          {
            pubkey: addrNode.publicKey,
            network: wallet.network.connect,
          },
        ),
        network: wallet.network.connect,
      });
      if (!wallet.network.segwit) {
        result = this.bitcoinlib.payments.p2pkh({
          pubkey: addrNode.publicKey, network: wallet.network.connect,
        });
      }
      const { address } = result;
      const addr: Address = {
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
    importWIF(
      wif: string,
      net: string,
    ): Object {
      // if (!this.networks[network].connect) {
      //   throw new Error('Invalid network type');
      // }
      const network = this.networkInfo ? this.networkInfo : this.networks[net];

      const keyPair: Bitcoinlib.ECPair = this.bitcoinlib.ECPair.fromWIF(
        wif,
        network.connect,
      );
      let result: any = this.bitcoinlib.payments.p2sh({
        redeem: this.bitcoinlib.payments.p2wpkh(
          {
            pubkey: keyPair.publicKey,
            network: network.connect,
          },
        ),
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
    broadcastTx(
      tx: string,
      net: string,
    ): Object {
      // if (!this.networks[network] || !this.networks[network].connect) {
      //   throw new Error('Invalid network type');
      // }
      const network = this.networkInfo ? this.networkInfo : this.networks[net];

      return new Promise((resolve, reject) => {
        if (network.segwit) {
          this.axios.post(network.broadcastUrl, { tx_hex: tx })
            .then((r:any) => {
              const res = r.data.data.txid;
              return resolve(res);
            })
            .catch((e:Error) => reject(new Error('Transaction failed')));
        } else {
          this.axios.post(`${network.discovery}/tx/send`, { rawtx: tx })
            .then((r:any) => {
              const { txid } = r.data;
              return resolve(txid);
            })
            .catch((e:Error) => reject(new Error('Transaction failed')));
        }
      });
    }

    /**
     * validates an address
     * @param address
     * @param network
     */
    validateAddress(
      address: string,
      net: string,
    ): boolean {
      const network = this.networkInfo ? this.networkInfo : this.networks[net];

      try {
        this.bitcoinlib.address.toOutputScript(address, network.connect);
      } catch (e) {
        return false;
      }
      return true;
    }

    /**
     * gets the estimated cost of a transaction
     * TODO: only works for bitcoin currently
     * @param network
     */
    getTransactionFee(
      net: string,
    ): Object {
      // if (!this.networks[network]) {
      //   throw new Error('Invalid network');
      // }
      const network = this.networkInfo ? this.networkInfo : this.networks[net];

      return new Promise((resolve, reject) => {
        const URL = network.feeApi;
        const kbToBytes = 1000;
        this.axios.get(URL)
          .then((r: any) => {
            resolve({
              high: r.data.high_fee_per_kb / kbToBytes,
              medium: r.data.medium_fee_per_kb / kbToBytes,
              low: r.data.low_fee_per_kb / kbToBytes,
            });
          })
          .catch((error: any) => reject(error.message));
      });
    }

    /**
    * returns a transaction object that contains the raw transaction hex
    * @param keypair
    * @param toAddress
    * @param amount
    */
    createRawTx(
      accounts: object[],
      change: string[],
      utxos: any,
      wallet: Wallet,
      toAddress: string,
      amount: number,
      minerRate: number,
      max?: boolean,
    ): Promise<Object> {
      if (!wallet || !wallet.network || !wallet.network.connect) {
        throw new Error('Invalid wallet type');
      }
      if (!this.validateAddress(toAddress, wallet.network.name)) {
        throw new Error(`Invalid to address "${toAddress}"`);
      }
      const feeRate: number = minerRate;
      const satoshisMultiplier = 100000000;
      const transactionAmount: number = Math.floor((amount * satoshisMultiplier));
      const net = wallet.network;
      let rawTx: any;
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
          let targets: any = [{
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
          const accountsUsed: any = [];
          const p2shUsed: any = [];
          const changeInputUsed: any = [];
          inputs.forEach((input: any) => {
            accounts.forEach((account: any) => {
              let key: any;
              if (input.address === account.address) {
                if (account.change) {
                  key = this.generateKeyPair(wallet, account.index, true);
                  changeInputUsed.push(account);
                } else {
                  key = this.generateKeyPair(wallet, account.index);
                }
                const keyPair = this.bitcoinlib.ECPair.fromWIF(key.privateKey, net.connect);
                const p2wpkh = this.bitcoinlib.payments.p2wpkh(
                  { pubkey: keyPair.publicKey, network: net.connect },
                );
                const p2sh = this.bitcoinlib.payments.p2sh(
                  { redeem: p2wpkh, network: net.connect },
                );
                accountsUsed.push(keyPair);
                p2shUsed.push(p2sh);
              }
            });
          });
          const txb = new this.bitcoinlib.TransactionBuilder(net.connect);
          txb.setVersion(1);
          inputs.forEach((input: any) => {
            txb.addInput(input.txid, input.vout);
          });
          let maxValue = 0;
          if (max) {
            outputs.forEach((output: any) => {
              maxValue += output.value;
            });
            txb.addOutput(toAddress, maxValue);
          } else {
            outputs.forEach((output: any) => {
              let { address } = output;
              if (!output.address) {
                ([address] = change);
              }
              txb.addOutput(address, output.value);
            });
          }
          let i = 0;
          inputs.forEach((input: any) => {
            if (wallet.network.segwit) {
              txb.sign(i, accountsUsed[i], p2shUsed[i].redeem.output, undefined, inputs[i].value);
            } else {
              txb.sign(i, accountsUsed[i]);
            }
            i += 1;
          });
          rawTx = txb.build().toHex();
          const senders: any = [];
          const convertMstoS = 1000;
          const txInputs = inputs.map((input: any) => {
            senders.push(input.address);
            return input.txid;
          });

          fee /= satoshisMultiplier;
          const transaction: Transaction = {
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
    verifyTxSignature(
      transaction: any,
      net: string,
    ): boolean {
      // if (!this.networks[network] || !this.networks[network].connect) {
      //   throw new Error('Invalid network type');
      // }

      const network = this.networkInfo ? this.networkInfo : this.networks[net];

      const keyPairs = transaction.pubKeys.map(
        (q: any) => this.bitcoinlib.ECPair.fromPublicKey(
          Buffer.from(q, 'hex'), network.connect,
        ),
      );
      const tx = this.bitcoinlib.Transaction.fromHex(transaction.txHex);
      const valid: boolean[] = [];
      tx.ins.forEach((input: any, i: number) => {
        const keyPair = keyPairs[i];
        const p2pkh = this.bitcoinlib.payments.p2pkh({
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
    accountDiscovery(
      wallet: Wallet,
      internal?: boolean,
    ): Object {
      if (!wallet || !wallet.network || !wallet.network.connect) {
        throw new Error('Invalid wallet type');
      }
      const apiUrl: string = wallet.network.discovery;
      let usedAddresses: object[] = [];
      const usedAddressesIndex: number[] = [];
      let emptyAddresses: number[] = [];
      let change: boolean = false;
      if (internal) {
        change = true;
      }

      const checkAddress = (address: string, i: number) => {
        const URL: string = `${apiUrl}/addr/${address}?noTxList=1`;
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
            } else {
              emptyAddresses.push(result.index);
            }
            return resolve(result);
          } catch (err) {
            return reject(err);
          }
        });
      };

      return new Promise(async (resolve, reject) => {
        let startIndex: number = 0;
        const discover = async () => {
          const promises = [];
          const gapLimit = 20;
          for (let i: number = startIndex; i < startIndex + gapLimit; i += 1) {
            const number: number = i;
            const keypair: KeyPair = this.generateKeyPair(wallet, number, internal);

            promises.push(
              checkAddress(keypair.address, number),
            );
          }
          try {
            await Promise.all(promises);
          } catch (err) {
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
        } catch (e) { return reject(e); }
        const result: any = {
          change,
          nextAddress: startIndex,
        };
        const allAddresses: object = usedAddresses;
        if (internal) {
          result.used = allAddresses;
          usedAddresses = usedAddresses.filter((item: any) => {
            if (item.balance === 0) return false;
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
    getTransactionHistory(
      addresses: string[],
      net: string,
      from: number,
      to: number,
    ): Object {
      // if (!this.networks[network].connect) {
      //   throw new Error(`${network} is an invalid network`);
      // }

      const network = this.networkInfo ? this.networkInfo : this.networks[net];

      const validAddress = (address: string) => this.validateAddress(address, network);
      if (!addresses.every(validAddress)) {
        throw new Error('Invalid address used');
      }
      return new Promise((resolve, reject) => {
        const apiUrl: string = network.discovery;
        const URL: string = `${apiUrl}/addrs/txs`;
        this.axios.post(URL, {
          addrs: addresses.toString(),
          from,
          to,
        })
          .then((r: any) => {
            if (r.data.totalItems === 0) { return resolve(); }
            let more: boolean = false;
            if (r.data.totalItems > to) { more = true; }
            const results: object[] = r.data.items;
            const transactions: Transaction[] = [];
            const minConfirmations = 5;

            results.forEach((result: any) => {
              let confirmed: boolean = false;
              if (result.confirmations > minConfirmations) { confirmed = true; }
              let sent: boolean = false;
              let value: number = 0;
              const change: string[] = [];
              const receivers: string[] = [];
              const senders: string[] = [];
              const inputs: string[] = [];

              result.vin.forEach((input: any) => {
                if (addresses.includes(input.addr)) {
                  sent = true;
                }
                senders.push(input.addr);
                inputs.push(input.txid);
              });
              result.vout.forEach((output: any) => {
                const outputAddr = output.scriptPubKey.addresses;
                const v = parseFloat(output.value);
                outputAddr.forEach((addr: any) => {
                  const ad = addr[0];
                  if (sent && !addresses.includes(addr)) {
                    receivers.push(addr);
                    value += v;
                  } else if (!sent && addresses.includes(addr)) {
                    value += v;
                    receivers.push(addr);
                  } else {
                    change.push(addr);
                  }
                });
              });

              const transaction: Transaction = {
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

            const history: object = {
              more,
              from,
              to,
              address: addresses,
              totalTransactions: r.data.totalItems,
              txs: transactions,
            };

            return resolve(history);
          })
          .catch((error: Error) => reject(new Error('API failed to get transaction history')));
      });
    }

    /**
     * gets the total balance of an array of addresses
     * @param addresses
     * @param network
     */
    getBalance(addresses: string[], net: string): Object {
      // if (!this.networks[network] || !this.networks[network].connect) {
      //   throw new Error(`${network} is an invalid network`);
      // }

      const network = this.networkInfo ? this.networkInfo : this.networks[net];

      const validAddress = (address: string) => this.validateAddress(address, net);
      if (!addresses.every(validAddress)) {
        throw new Error('Invalid address used');
      }

      return new Promise((resolve, reject) => {
        let balance: number = 0;
        const apiUrl: string = network.discovery;
        const URL:string = `${apiUrl}/addrs/utxo`;

        this.axios.post(URL, {
          addrs: addresses.toString(),
        })
          .then((r: any) => {
            if (r.data.length === 0) {
              balance = 0;
              return resolve(balance);
            }

            r.data.forEach((utxo: any) => {
              balance += utxo.amount;
            });

            return resolve(balance);
          })
          .catch((error: any) => reject(new Error('API failed to return a balance')));
      });
    }
  }

}

export default CryptoWallet.SDKS.GenericSDK;
