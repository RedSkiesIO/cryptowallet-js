/* eslint-disable import/no-unresolved */
/* eslint-disable spaced-comment */
// eslint-disable-next-line spaced-comment
///<reference path="../../types/module.d.ts" />
import * as BitcoinLib from 'bitcoinjs-lib';
import * as Coinselect from 'coinselect';
import * as CoinSelectSplit from 'coinselect/split';
import { KeyPair, Wallet } from '../GenericSDK.d';
import * as IBitcoinSDK from './IBitcoinSDK';
import GenericSDK from '../GenericSDK';

export namespace CryptoWallet.SDKS.Bitcoin {
  export class BitcoinSDK extends GenericSDK
    implements IBitcoinSDK.CryptoWallet.SDKS.Bitcoin.IBitcoinSDK {
    /**
     * generates a segwit address
     * @param keyPair
     */
    generateSegWitAddress(
      keyPair: KeyPair,
    ): string {
      const key: BitcoinLib.ECPair = this.bitcoinlib.ECPair.fromWIF(
        keyPair.privateKey,
        keyPair.network.connect,
      );
      const { address } = this.bitcoinlib.payments.p2wpkh(
        {
          pubkey: key.publicKey,
          network: keyPair.network.connect,
        },
      );
      return address;
    }

    /**
     * generates a segwit P2SH address
     * @param keyPair
     */
    generateSegWitP2SH(
      keyPair: KeyPair,
    ): string {
      const key: BitcoinLib.ECPair = this.bitcoinlib.ECPair.fromWIF(
        keyPair.privateKey,
        keyPair.network.connect,
      );
      const { address } = this.bitcoinlib.payments.p2sh({
        redeem: this.bitcoinlib.payments.p2wpkh(
          {
            pubkey: key.publicKey,
            network: keyPair.network.connect,
          },
        ),
        network: keyPair.network.connect,
      });
      return address;
    }

    /**
     * generates a 3 0f 4 multisig segwit address
     * @param key1
     * @param key2
     * @param key3
     * @param key4
     * @param network
     */
    generateSegWit3of4MultiSigAddress(
      key1: string,
      key2: string,
      key3: string,
      key4: string,
      network: string,
    ): string {
      const pubkeys: any = [key1, key2, key3, key4].map(hex => Buffer.from(hex, 'hex'));
      const { address } = this.bitcoinlib.payments.p2wsh({
        redeem: this.bitcoinlib.payments.p2ms({
          pubkeys,
          m: 3,
          network: this.networks[network].connect,
        }),
        network: this.networks[network].connect,
      });
      return address;
    }

    /**
     *  generates a P2SH multisig keypair
     * @param keys
     * @param network
     */
    gernerateP2SHMultiSig(
      keys: string[],
      network: string,
    ): string {
      const pubkeys: Buffer[] = keys.map(hex => Buffer.from(hex, 'hex'));
      const { address } = this.bitcoinlib.payments.p2sh({
        redeem: this.bitcoinlib.payments.p2wsh({
          redeem: this.bitcoinlib.payments.p2ms({
            pubkeys,
            m: pubkeys.length,
            network: this.networks[network].connect,
          }),
          network: this.networks[network].connect,
        }),
        network: this.networks[network].connect,
      });
      return address;
    }

    /**
     *  gets the unspent transactions for an array of addresses
     * @param addresses
     * @param network
     */
    getUTXOs(
      addresses: string[],
      network: string,
    ): Object {
      return new Promise((resolve, reject) => {
        const apiUrl: string = this.networks[network].discovery;
        const URL:string = `${apiUrl}/addrs/${addresses.toString()}/utxo`;

        this.axios.get(URL)
          .then((r: any) => {
            const result: any = [];

            if (r.data.length === 0) {
              // if no transactions have happened, there is no balance on the address.
              return resolve(result);
            }

            r.data.forEach((utxo: any) => {
              const u = utxo;
              u.value = utxo.satoshis;
              result.push(u);
            });


            return resolve(result);
          })
          .catch((error: Error) => reject(error));
      });
    }

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
    createTxToMany(
      accounts: object[],
      change: string[],
      utxos: any,
      wallet: Wallet,
      toAddresses: string[],
      amounts: number[],
      minerRate: number,
    ): Object {
      if (!wallet.network.connect) {
        throw new Error('Invalid wallet type');
      }

      // if (!this.validateAddress(toAddress, wallet.network.name)) {
      //   throw new Error('Invalid to address');
      // }

      const reducer = (accumulator: number, currentValue: number) => accumulator + currentValue;
      const feeRate: number = minerRate;
      const amount: number = amounts.reduce(reducer);
      const transactionAmount: number = Math.floor((amount * 100000000));
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
        if ((balance - transactionAmount - feeRate) > 0) {
          const targets: any = [];
          const satoshisMultiplier: number = 100000000;
          const createTargets = (address: string, index: number) => {
            const target: any = {
              address,
              value: Math.floor(amounts[index] * satoshisMultiplier),
            };
            targets.push(target);
          };
          toAddresses.forEach(createTargets);
          // const targets: any = [{
          //   address: toAddress,
          //   value: transactionAmount,
          // },
          // ];

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
          fee /= satoshisMultiplier;

          const transaction = {
            fee,
            change,
            receiver: [toAddresses],
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
            changeInputUsed,
            transaction,
            hexTx: rawTx,
            utxo: spentInput,

          });
        }
        return reject(new Error("You don't have enough Satoshis to cover the miner fee."));
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
     * @param keypair
     * @param txHash
     * @param txNumber
     * @param address
     * @param amount
     */
    create1t1tx(
      keypair: BitcoinLib.ECPair,
      txHash: string,
      txNumber: number,
      address: string,
      amount: number,
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
     * @param txparams
     */
    create2t2tx(
      txparams: any,
    ): String {
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
}
export default CryptoWallet.SDKS.Bitcoin.BitcoinSDK;
