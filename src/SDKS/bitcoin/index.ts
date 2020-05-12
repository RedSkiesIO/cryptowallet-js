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
///<reference path="../../types/module.d.ts" />
import * as BitcoinLib from 'bitcoinjs-lib';
import * as Coinselect from 'coinselect';
import * as CoinSelectSplit from 'coinselect/split';
import { KeyPair, Wallet, BitcoinNetwork } from '../GenericSDK.d';
import * as IBitcoinSDK from './IBitcoinSDK';
import GenericSDK from '../GenericSDK';


export namespace CryptoWallet.SDKS.Bitcoin {
  export class BitcoinSDK extends GenericSDK
    implements IBitcoinSDK.CryptoWallet.SDKS.Bitcoin.IBitcoinSDK {

      constructor(net?: BitcoinNetwork) {
        super(net);
      }
    /**
     * generates a segwit address
     * @param keyPair
     */
    generateSegWitAddress(
      keyPair: KeyPair,
    ): string {
      if (!keyPair.network || !keyPair.network.connect) {
        throw new Error('Invalid keypair type');
      }
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
      if (!keyPair.network || !keyPair.network.connect) {
        throw new Error('Invalid keypair type');
      }
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
      net: string,
    ): string {
      const network = this.networkInfo ? this.networkInfo : this.networks[net];
       if (!network || !network.connect) {
        throw new Error('Invalid network');
      }

      try {
        const pubkeys: any = [key1, key2, key3, key4].map(hex => Buffer.from(hex, 'hex'));
        const { address } = this.bitcoinlib.payments.p2wsh({
          redeem: this.bitcoinlib.payments.p2ms({
            pubkeys,
            m: 3,
            network: network.connect,
          }),
          network: network.connect,
        });
        return address;
      } catch (e) {
        throw new Error('Invalid public key used');
      }
    }

    /**
     *  generates a P2SH multisig keypair
     * @param keys
     * @param network
     */
    generateP2SHMultiSig(
      keys: string[],
      net: string,
    ): string {
      
      const network = this.networkInfo ? this.networkInfo : this.networks[net];
      if (!network || !network.connect) {
        throw new Error('Invalid network');
      }
      try {
        const pubkeys: Buffer[] = keys.map(hex => Buffer.from(hex, 'hex'));
        const { address } = this.bitcoinlib.payments.p2sh({
          redeem: this.bitcoinlib.payments.p2wsh({
            redeem: this.bitcoinlib.payments.p2ms({
              pubkeys,
              m: pubkeys.length,
              network: network.connect,
            }),
            network: network.connect,
          }),
          network: network.connect,
        });
        return address;
      } catch (e) {
        throw new Error('Invalid public key used');
      }
    }

    /**
     *  gets the unspent transactions for an array of addresses
     * @param addresses
     * @param network
     */
    getUTXOs(
      addresses: string[],
      net: string,
    ): Object {
      // if (!this.networks[network] || !this.networks[network].connect) {
      //   throw new Error('Invalid network');
      // }
      const network = this.networkInfo ? this.networkInfo : this.networks[net];
      const validAddress = (address: string) => this.validateAddress(address, net);
      if (!addresses.every(validAddress)) {
        throw new Error('Invalid address used');
      }
      return new Promise((resolve, reject) => {
        const apiUrl: string = network.discovery;
        const URL:string = `${apiUrl}/addrs/utxo`;

        this.axios.post(URL, {
          addrs: addresses.toString(),
        })
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
          .catch((error: Error) => reject(new Error('Failed to fetch UTXOs')));
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
      if (!wallet.network || !wallet.network.connect) {
        throw new Error('Invalid wallet type');
      }

      const reducer = (accumulator: number, currentValue: number) => accumulator + currentValue;
      const feeRate: number = minerRate;
      const amount: number = amounts.reduce(reducer);
      const satoshisMultiplier: number = 100000000;
      const transactionAmount: number = Math.floor((amount * satoshisMultiplier));
      const net = wallet.network;
      let rawTx: any;

      return new Promise(async (resolve, reject) => {
        if (utxos.length === 0) {
          return reject(new Error("You don't have enough balance to cover transaction"));
        }
        let balance = 0;
        for (let i = 0; i < utxos.length; i += 1) {
          balance += utxos[i].value;
        }

        if ((balance - transactionAmount - feeRate) > 0) {
          const targets: any = [];

          const createTargets = (address: string, index: number) => {
            const target: any = {
              address,
              value: Math.floor(amounts[index] * satoshisMultiplier),
            };
            targets.push(target);
          };
          toAddresses.forEach(createTargets);
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
          const convertMsToS = 1000;
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
            receivedTime: new Date().getTime() / convertMsToS,
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

    /**
     *
     * @param keypair
     * @param txHash
     * @param txNumber
     * @param address
     * @param amount
     */
    create1t1tx(
      keypair: KeyPair,
      txHash: string,
      txNumber: number,
      txValue: number,
      address: string,
      amount: number,
    ): String {
      if (!keypair.network || !keypair.network.connect) {
        throw new Error('Invalid keypair');
      }
      const key = this.bitcoinlib.ECPair.fromWIF(keypair.privateKey, keypair.network.connect);
      const p2wpkh = this.bitcoinlib.payments.p2wpkh(
        { pubkey: key.publicKey, network: keypair.network.connect },
      );
      const p2sh = this.bitcoinlib.payments.p2sh(
        { redeem: p2wpkh, network: keypair.network.connect },
      );
      const txb = new this.bitcoinlib.TransactionBuilder(keypair.network.connect);

      txb.setVersion(1);
      txb.addInput(txHash, txNumber);
      txb.addOutput(address, amount);

      if (keypair.network.segwit) {
        txb.sign(0, key, p2sh.redeem.output, undefined, txValue);
      } else {
        txb.sign(0, key);
      }
      return txb.build().toHex();
    }

    /**
     *
     * @param txparams
     */
    create2t2tx(
      keypair1: KeyPair,
      keypair2: KeyPair,
      utxo1: any,
      utxo2: any,
      output1: any,
      output2: any,
    ): String {
      if (
        !keypair1.network
        || !keypair1.network.connect
        || !keypair2.network
        || !keypair2.network.connect
      ) {
        throw new Error('Invalid keypair');
      }
      const key1 = this.bitcoinlib.ECPair.fromWIF(keypair1.privateKey, keypair1.network.connect);
      const key2 = this.bitcoinlib.ECPair.fromWIF(keypair2.privateKey, keypair2.network.connect);
      const p2wpkh1 = this.bitcoinlib.payments.p2wpkh(
        { pubkey: key1.publicKey, network: keypair1.network.connect },
      );
      const p2wpkh2 = this.bitcoinlib.payments.p2wpkh(
        { pubkey: key2.publicKey, network: keypair2.network.connect },
      );

      const p2sh1 = this.bitcoinlib.payments.p2sh(
        { redeem: p2wpkh1, network: keypair1.network.connect },
      );
      const p2sh2 = this.bitcoinlib.payments.p2sh(
        { redeem: p2wpkh2, network: keypair2.network.connect },
      );
      const txb = new this.bitcoinlib.TransactionBuilder(keypair1.network.connect);
      txb.setVersion(1);
      txb.addInput(utxo1.txid, utxo1.vout);
      txb.addInput(utxo2.txid, utxo2.vout);
      txb.addOutput(output1.address, output1.amount);
      txb.addOutput(output2.address, output2.amount);
      if (keypair1.network.segwit) {
        txb.sign(0, key1, p2sh1.redeem.output, undefined, output1.amount);
      } else {
        txb.sign(0, key1);
      }
      if (keypair2.network.segwit) {
        txb.sign(1, key2, p2sh2.redeem.output, undefined, output2.amount);
      } else {
        txb.sign(1, key2);
      }
      return txb.build().toHex();
    }
  }
}
export default CryptoWallet.SDKS.Bitcoin.BitcoinSDK;
