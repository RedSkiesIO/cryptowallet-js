/* eslint-disable import/no-unresolved */
// eslint-disable-next-line spaced-comment
/// <reference path="../../types/module.d.ts" />
import * as Bip39 from 'bip39';
import * as Bip44hdkey from 'hdkey';
import * as Bitcoinlib from 'bitcoinjs-lib';
import * as Wif from 'wif';
import * as Request from 'request';
import * as Axios from 'axios';
import * as Coinselect from 'coinselect';
import * as CoinSelectSplit from 'coinselect/split';
import * as Networks from './networks';
import * as ISDK from './ISDK';

export namespace CryptoWallet.SDKS {
  export abstract class GenericSDK implements ISDK.CryptoWallet.SDKS.ISDK {
    bitcoinlib = Bitcoinlib;

    networks: any = Networks;

    bip39: any = Bip39;

    wif: any = Wif;

    request: any = Request;

    axios: any = Axios;

    generateHDWallet(entropy: string, network: string): Object {
      const cointype = this.networks[network].bip;
      const root = Bip44hdkey.fromMasterSeed(
        this.bip39.mnemonicToSeed(entropy),
      ); // root of node tree
      let externalNode;
      let internalNode;
      let bip;
      if (this.networks[network].segwit) {
        externalNode = root.derive(`m/49'/${cointype}'/0'/0`);
        internalNode = root.derive(`m/49'/${cointype}'/0'/1`); // needed for bitcoin
        bip = 49;
      } else {
        externalNode = root.derive(`m/44'/${cointype}'/0'/0`);
        internalNode = root.derive(`m/44'/${cointype}'/0'/1`); // needed for bitcoin
        bip = 44;
      }
      const wallet: object = {
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
    *
    * @param wallet
    * @param index
    * @param external
    */
    generateKeyPair(wallet: any, index: number, internal?: boolean): Object {
      let node = wallet.externalNode;
      if (internal) { node = wallet.internalNode; }
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

    broadcastTx(tx: object, network: string): Object {
      return new Promise((resolve, reject) => {
        if (this.networks[network].segwit) {
          Request.post(this.networks[network].broadcastUrl,
            {
              form: {
                tx_hex: tx,
              },
            },
            (error: any, body: any, result: any) => {
              if (error) {
                return resolve(new Error(`Transaction failed: ${error}`));
              }
              console.log('result :', result);
              const output = JSON.parse(result);
              const res = output.data.txid;
              return resolve(res);
            });
        } else {
          Request.post(`${this.networks[network].discovery}/tx/send`,
            {
              form: {
                rawtx: tx,
              },
            },
            (error: any, body: any, result: any) => {
              if (error) {
                return resolve(new Error(`Transaction failed: ${error}`));
              }
              console.log('result :', result);
              const res = result.txid;
              return resolve(res);
            });
        }
      });
    }

    /**
    *
    * @param wif
    */
    importWIF(wif: string, network: string): Object {
      const keyPair = this.bitcoinlib.ECPair.fromWIF(wif, this.networks[network].connect);

      const { address } = this.bitcoinlib.payments.p2sh({
        redeem: this.bitcoinlib.payments.p2wpkh(
          {
            pubkey: keyPair.publicKey,
            network: this.networks[network].connect,
          },
        ),
        network: this.networks[network].connect,
      });
      return address;
    }

    /**
 *
 * @param keypair
 * @param toAddress
 * @param amount
 */
    createRawTx(
      accounts: object[],
      change: string[],
      utxos: any,
      wallet: any,
      toAddress: string,
      amount: number,
    ): Object {
      const feeRate = 128;
      const transactionAmount = amount * 100000000;
      const minerFee = 0.0001 * 100000000;
      const net = wallet.network;
      let rawTx: any;

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
          const targets: any = [{
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

          let { inputs, outputs, fee } = result;
          console.log('fees :', fee);

          const accountsUsed: any = [];
          const p2shUsed: any = [];
          console.log(`Inputs:${inputs}`);
          inputs.forEach((input: any) => {
            accounts.forEach((account: any) => {
              let key: any;
              if (input.address === account.address) {
                if (account.change) {
                  key = this.generateKeyPair(wallet, account.index, true);
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

          outputs.forEach((output: any) => {
            let { address } = output;
            if (!output.address) {
              ([address] = change);
            }
            txb.addOutput(address, output.value);
          });
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
          inputs.forEach((input: any) => {
            senders.push(input.address);
          });
          fee /= 100000000;

          const transaction = {
            fee,
            change,
            receiver: toAddress,
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

    /**
    *
    * @param transaction
    */
    verifyTxSignature(transaction: any, network: string): boolean {
      const keyPairs = transaction.pubKeys.map((q: any) => this.bitcoinlib.ECPair.fromPublicKey(Buffer.from(q, 'hex'), this.networks[network].connect));

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
        valid.push(hash === ss.signature);
      });
      return valid.every(item => item === true);
    }

    accountDiscovery(entropy: string, network: string, internal?: boolean): Object {
      const wallet: any = this.generateHDWallet(entropy, network);
      const apiUrl = wallet.network.discovery;

      let usedAddresses: any = [];
      const emptyAddresses: any = [];
      let change = false;
      if (internal) {
        change = true;
      }

      const checkAddress = (address: string, i: number) => {
        const URL = `${apiUrl}/addr/${address}?noTxList=1`;

        return new Promise(async (resolve, reject) => {
          this.axios.get(URL)
            .then((addr: any) => {
              const result = {
                address,
                received: addr.data.totalReceived,
                balance: addr.data.balance,
                index: i,
              };


              if (result.received > 0) {
                usedAddresses.push(result);
              } else {
                emptyAddresses.push(result.index);
              }
              return resolve(result);
            })
            .catch((error: any) => reject(new Error(error)));
        });
      };

      return new Promise(async (resolve, reject) => {
        let startIndex = 0;

        const discover = async () => {
          const promises = [];

          for (let i: any = startIndex; i < startIndex + 20; i += 1) {
            const number = i;
            const keypair: any = this.generateKeyPair(wallet, number, internal);

            promises.push(
              new Promise(async (res, rej) => res(checkAddress(keypair.address, number))),
            );
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

        const result: any = {
          change,
          nextAddress: startIndex,
        };
        const allAddresses = usedAddresses;
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

    // abstract getUTXOs(addresses: String[], network: string): Object;

    // getWalletHistory(
    //   addresses: string[],
    //   network: string,
    //   lastBlock: number,
    //   full?: boolean,
    // ): Object {
    //   const result: any = [];
    //   return new Promise((resolve, reject) => {
    //     const promises: any = [];

    //     addresses.forEach((address: any) => {
    //       promises.push(
    //         new Promise(async (res, rej) => {
    //           if (full) {
    //             const history: any = await this.getTransactionHistory(address,
    //               addresses,
    //               network,
    //               lastBlock,
    //               undefined, 50);

    //             if (typeof history === 'undefined') {
    //               return res();
    //             }

    //             if (history.hasMore) {
    //               let more = true;
    //               let lBlock = history.lastBlock;
    //               while (more) {
    //                 // eslint-disable-next-line no-await-in-loop
    //                 const nextData: any = await this.getTransactionHistory(
    //                   address, addresses, network, 0, lBlock,
    //                 );
    //                 nextData.txs.forEach((tx: any) => {
    //                   history.txs.push(tx);
    //                 });
    //                 if (typeof nextData.hasMore === 'undefined') { more = false; }
    //                 lBlock = nextData.lastBlock;
    //               }
    //             }
    //             result.push(history);
    //           } else {
    //             const history = await this.getTransactionHistory(
    //               address, addresses, network, lastBlock,
    //             );
    //             result.push(history);
    //           }
    //           return res();
    //         }),
    //       );
    //     });
    //     Promise.all(promises).then(() => {
    //       resolve(result);
    //     });
    //   });
    // }

    // getTransactionHistory(
    //   address: string,
    //   addresses: string[],
    //   network: string,
    //   lastBlock: number,
    //   beforeBlock?: number,
    //   limit?: number,
    // ): Object {
    //   const apiUrl = this.networks[network].getTranApi;
    //   let returnAmount = 10;
    //   if (limit != null) { returnAmount = limit; }
    //   let URL = `${apiUrl + address}
    // /full?${this.networks.token}&after=${lastBlock}&limit=${returnAmount}`;

    //   if (beforeBlock != null) {
    //     URL = `${apiUrl + address}
    // /full?${this.networks.token}&before=${lastBlock}&limit=${returnAmount}`;
    //   }

    //   return new Promise((resolve, reject) => {
    //     this.axios.get(URL)
    //       .then((r: any) => {
    //         if (r.data.txs.length === 0) { return resolve(); }
    //         const more: boolean = r.data.hasMore;
    //         const results = r.data.txs;
    //         const transactions: any = [];
    //         const oldestBlock: number = results[results.length - 1].block_height - 1;

    //         results.forEach((result: any) => {
    //           let confirmed = false;
    //           if (result.confirmations > 5) { confirmed = true; }
    //           let sent: boolean = false;
    //           let value: number = 0;
    //           let change: number = 0;
    //           const receivers: any = [];
    //           const senders: any = [];

    //           result.inputs.forEach((input: any) => {
    //             const inputAddr = input.addresses;
    //             inputAddr.forEach((addr: any) => {
    //               if (addr === address) {
    //                 sent = true;
    //               }
    //               senders.push(addr);
    //             });
    //           });
    //           result.outputs.forEach((output: any) => {
    //             const outputAddr = output.addresses;
    //             outputAddr.forEach((addr: any) => {
    //               if (sent && !addresses.includes(addr)) {
    //                 receivers.push(addr);
    //                 value += output.value;
    //               } else if (!sent && addresses.includes(addr)) {
    //                 ({ value } = output);
    //                 receivers.push(addr);
    //               } else {
    //                 change = output.value;
    //               }
    //             });
    //           });

    //           const transaction = {
    //             sent,
    //             value,
    //             change,
    //             confirmed,
    //             confirmations: result.confirmations,
    //             hash: result.hash,
    //             blockHeight: result.block_height,
    //             fee: result.fees,
    //             sender: senders,
    //             receiver: receivers,
    //             receivedTime: result.received,
    //             confirmedTime: result.confirmed,
    //           };
    //           transactions.push(transaction);
    //         });

    //         const history = {
    //           more,
    //           address: r.data.address,
    //           balance: r.data.balance,
    //           unconfirmedBalance: r.data.unconfirmed_balance,
    //           finalBalance: r.data.final_balance,
    //           totalTransactions: r.data.n_tx,
    //           finalTotalTransactions: r.data.final_n_tx,
    //           lastBlock: oldestBlock,
    //           txs: transactions,
    //         };

    //         return resolve(history);
    //       })
    //       .catch((error: any) => reject(error));
    //   });
    // }

    getTransactionHistory(
      addresses: string[],
      network: string,
      from: number,
      to: number,
    ): Object {
      const apiUrl = this.networks[network].discovery;
      const returnAmount = 10;

      const URL = `${apiUrl}/addrs/${addresses.toString()}/txs?from=${from}&to=${to}`;

      console.log(URL);


      return new Promise((resolve, reject) => {
        this.axios.get(URL)
          .then((r: any) => {
            if (r.data.totalItems === 0) { return resolve(); }
            let more: boolean = false;
            if (r.data.totalItems > to) { more = true; }
            const results = r.data.items;
            const transactions: any = [];


            results.forEach((result: any) => {
              let confirmed = false;
              if (result.confirmations > 5) { confirmed = true; }
              let sent: boolean = false;
              let value: number = 0;
              let change: number = 0;
              const receivers: any = [];
              const senders: any = [];

              result.vin.forEach((input: any) => {
                if (addresses.includes(input.addr)) {
                  sent = true;
                }
                senders.push(input.addr);
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
          .catch((error: any) => reject(error));
      });
    }

    getBalance(addresses: string[], network: string): Object {
      let balance = 0;
      let totalReceived = 0;
      let totalSent = 0;
      let unconfirmedBalance = 0;
      let txAmount = 0;
      let unconfirmedTxAmount = 0;
      const promises: any = [];
      const apiUrl = this.networks[network].discovery;

      const getAddrBalance = (addr: string) => {
        const URL = `${apiUrl}/addr/${addr}?noTxList=1`;

        return new Promise((resolve, reject) => {
          this.axios.get(URL)
            .then((r: any) => {
              balance += r.data.balance;
              totalReceived += r.data.totalReceived;
              totalSent += r.data.totalSent;
              unconfirmedBalance += r.data.unconfirmedBalance;
              txAmount += r.data.txApperances;
              unconfirmedTxAmount += r.data.unconfirmedTxApperances;
              resolve();
            });
        });
      };
      return new Promise(async (resolve, reject) => {
        addresses.forEach((addr) => {
          promises.push(
            new Promise(async (res, rej) => res(getAddrBalance(addr))),
          );
        });
        await Promise.all(promises);

        return resolve(
          {
            balance,
            totalReceived,
            totalSent,
            unconfirmedBalance,
            txAmount,
            unconfirmedTxAmount,
          },
        );
      });
    }
  }

}

export default CryptoWallet.SDKS.GenericSDK;
