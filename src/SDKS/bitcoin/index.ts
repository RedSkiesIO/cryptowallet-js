/* eslint-disable import/no-unresolved */
// eslint-disable-next-line spaced-comment
///<reference path="../../types/module.d.ts" />
import * as BitcoinLib from 'bitcoinjs-lib';
import * as Bitcoinaddress from 'bitcoin-address';
import * as Coinselect from 'coinselect';
import * as CoinSelectSplit from 'coinselect/split';
import * as Request from 'request';
import * as Explorers from 'bitcore-explorers';
import * as Networks from '../networks';
import * as IBitcoinSDK from './IBitcoinSDK';
import GenericSDK from '../GenericSDK';

namespace CryptoWallet.SDKS.Bitcoin {
  export class BitcoinSDK extends GenericSDK
    implements IBitcoinSDK.CryptyoWallet.SDKS.Bitcoin.IBitcoinSDK {
    Explore = Explorers

    Req = Request

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
      const { address } = this.bitcoinlib.payments.p2sh({
        redeem: this.bitcoinlib.payments.p2wpkh(
          {
            pubkey: addrNode.publicKey,
            network: wallet.network.connect,
          },
        ),
        network: wallet.network.connect,
      });

      const keypair = {
        address,
        publicKey: addrNode.publicKey.toString('hex'),
        privateKey: this.wif.encode(wallet.network.connect.wif, addrNode.privateKey, true),
        derivationPath: `m/49'/${wallet.type}'/0'/0/${index}`,
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
    generateSegWitAddress(keyPair: any): Object {
      return this.bitcoinlib.payments.p2wpkh(
        {
          pubkey: keyPair.publicKey,
          network: keyPair.network,
        },
      );
    }

    /**
     *
     * @param keyPair
     */
    generateSegWitP2SH(keyPair: any): Object {
      return this.bitcoinlib.payments.p2sh({
        redeem: this.bitcoinlib.payments.p2wpkh(
          {
            pubkey: keyPair.publicKey,
            network: keyPair.network,
          },
        ),
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
    importWIF(wif: string): Object {
      const keyPair = this.bitcoinlib.ECPair.fromWIF(wif);
      const { address } = this.bitcoinlib.payments.p2sh({
        redeem: this.bitcoinlib.payments.p2wpkh({ pubkey: keyPair.publicKey }),
      });
      return address;
    }

    /**
     *
     * @param keys
     */
    gernerateP2SHMultiSig(keys: string[]): Object {
      const pubkeys: any[] = keys.map(hex => Buffer.from(hex, 'hex'));
      return this.bitcoinlib.payments.p2sh({
        redeem: this.bitcoinlib.payments.p2ms({ pubkeys, m: pubkeys.length }),
      });
    }

    getUTXOs(addresses: string[], network: string): Object {
      return new Promise((resolve, reject) => {
        const unit = Explorers.Unit;
        const insight = new this.Explore.Insight('https://test-insight.bitpay.com', 'testnet');
        insight.getUnspentUtxos(addresses, (error: string, utxos: any) => {
          if (error) {
            // any other error
            return reject(error);
          }

          const result: any = [];

          if (utxos.length === 0) {
            // if no transactions have happened, there is no balance on the address.
            return resolve(result);
          }

          utxos.forEach((utxo: any) => {
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
    createRawTx(
      accounts: object[],
      change: string[],
      utxos: any,
      wallet: any,
      toAddress: string,
      amount: number,
    ): Object {
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

          const { inputs, outputs, fee } = result;
          console.log(`inputs:${inputs}`);
          const accountsUsed: any = [];
          const p2shUsed: any = [];
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

          const txb = new BitcoinLib.TransactionBuilder(net.connect);

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

          inputs.forEach((input: any) => {
            let i = 0;
            txb.sign(i, accountsUsed[i], p2shUsed[i].redeem.output, undefined, inputs[i].value);
            i += 1;
          });
          rawTx = txb.build().toHex();

          const transaction = await this.decodeTx(
            rawTx,
            change,
            transactionAmount,
            toAddress,
            wallet,
          );
          const spentInput = inputs;

          return resolve({
            transaction,
            hexTx: rawTx,
            utxo: spentInput,
          });
        }
        return resolve("2: You don't have enough Satoshis to cover the miner fee.");
      });
    }

    broadcastTx(rawTx: object, network: string): Object {
      const tx = {
        tx: rawTx,
      };
      return new Promise((resolve, reject) => {
        Request.post(
          {
            url: this.networks[network].sendTxApi,
            form: JSON.stringify(tx),
          },
          (error: any, body: any, result: any) => {
            if (error) {
              return reject(new Error(`Transaction failed: ${error}`));
            }
            const output = JSON.parse(result);
            const res = output.tx.hash;
            return resolve(res);
          },
        );
      });
    }

    decodeTx(rawTx: Object,
      change: string[],
      amount: number,
      receiver: string,
      wallet: any): Object {
      const tx = {
        tx: rawTx,
      };
      return new Promise((resolve, reject) => {
        this.Req.post(
          {
            url: wallet.network.decodeTxApi,
            form: JSON.stringify(tx),
          },
          (error: any, body: any, result: any) => {
            if (error) {
              return reject(new Error(`Transaction failed: ${error}`));
            }
            const output = JSON.parse(result);
            let confirmed = false;
            if (output.confirmations > 5) { confirmed = true; }
            const senders: any = [];
            output.inputs.forEach((input: any) => {
              const inputAddr = input.addresses;
              inputAddr.forEach((addr: any) => {
                senders.push(addr);
              });
            });
            const transaction = {
              change,
              receiver,
              confirmed,
              confirmations: output.confirmations,
              hash: output.hash,
              blockHeight: output.block_height,
              fee: output.fees,
              sent: true,
              value: amount,
              sender: senders,
              receivedTime: output.received,
              confirmedTime: output.confirmed,

            };
            return resolve(transaction);
          },
        );
      });
    }

    /**
     *
     * @param transaction
     */
    verifyTxSignature(transaction: any): boolean {
      const keyPairs = transaction.pubKeys.map((q: any) => this.bitcoinlib.ECPair.fromPublicKey(Buffer.from(q, 'hex')));

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

    /**
     *
     */
    create1t1tx(
      keypair: any, txHash: string, txNumber: number, address: string, amount: number,
    ): String {
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
    create2t2tx(txparams: any): String {
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

    accountDiscovery(entropy: string, network: string, internal?: boolean): Object {
      const wallet = this.generateHDWallet(entropy, network);

      const insight: any = new Explorers.Insight('https://testnet.blockexplorer.com/', 'testnet');
      let usedAddresses: any = [];
      const emptyAddresses: any = [];
      let change = false;
      if (internal) {
        change = true;
      }

      function checkAddress(address: string, i: number): Promise<object> {
        return new Promise(async (resolve, reject) => {
          await insight.address(address, (err: any, addr: any) => {
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
            } else {
              emptyAddresses.push(result.index);
            }
            return resolve(result);
          });
        });
      }

      return new Promise(async (resolve, reject) => {
        // let discover = true;
        let startIndex = 0;

        const discover = async () => {
          const promises = [];

          for (let i: any = startIndex; i < startIndex + 20; i += 1) {
            const keypair: any = this.generateKeyPair(wallet, i, internal);

            promises.push(new Promise(async (res, rej) => res(checkAddress(keypair.address, i))));
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
        discover();
        if (internal) {
          usedAddresses = usedAddresses.filter((item: any) => {
            if (item.balance === 0) return false;
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
}
export default CryptoWallet.SDKS.Bitcoin.BitcoinSDK;
