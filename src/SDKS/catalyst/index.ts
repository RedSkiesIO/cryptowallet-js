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
import * as Bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import ERPC from '@etclabscore/ethereum-json-rpc';
import { HDWalletProvider } from '@catalyst-net-js/truffle-provider';
import CatalystWallet from '@catalyst-net-js/wallet';
import CatalystTx from '@catalyst-net-js/tx';
import {hexStringFromBytes, numberFromBytes} from '@catalyst-net-js/common'
import * as EthereumLib from 'ethereumjs-wallet';
import * as EthereumTx from 'ethereumjs-tx';
import * as Web3 from 'web3';
import {
  KeyPair, Wallet, Address,
} from '../GenericSDK.d';
import GenericSDK from '../GenericSDK';
import * as ICatalystSDK from './ICatalystSDK';
import Transaction from './catalystTypes';

export namespace CryptoWallet.SDKS.Catalyst {
  export class CatalystSDK extends GenericSDK
    implements ICatalystSDK.CryptoWallet.SDKS.Catalyst.ICatalystSDK {
    ethereumlib = EthereumLib;
    Web3:any = Web3;
    VerifyTx: any;
    bip39: any = Bip39;
    walletHdpath = 'm/44\'/42069\'/';

    generateHDWallet(entropy: string, network: any): Wallet{
      if (!this.bip39.validateMnemonic(entropy)) {
        throw new TypeError('Invalid entropy');
      }

      const seed = this.bip39.mnemonicToSeedHex(entropy);
    
      return {
        ext: seed,
        int: null,
        bip: 44,
        type: 42069,
        network: network,
      }
    };

    /**
     * generate an ethereum keypair using a HD wallet object
     * @param wallet
     * @param index
     */
    generateKeyPair(
      wallet: Wallet,
      index: number,
    ): KeyPair {
      if (!wallet.network || wallet.network.connect) {
        throw new Error('Invalid wallet type');
      }
      const data = derivePath(`${this.walletHdpath + index}'`, wallet.ext);
      
        const wal = CatalystWallet.generateFromSeed(data.key);

      const keypair: KeyPair = {
        publicKey: wal.getPublicKeyString(),
        address: wal.getAddressString(),
        derivationPath: `${this.walletHdpath + index}'`,
        privateKey: wal.getPrivateKeyString(),
        type: 'Catalyst',
        network: wallet.network,
      };
      return keypair;
    }

    /**
    * generates an etherum address using a HD wallet object
    * @param wallet
    * @param index
    */
    generateAddress(
      wallet: Wallet,
      index: number,
    ): Address {
      if (!wallet.network || wallet.network.connect) {
        throw new Error('Invalid wallet type');
      }
      const data = derivePath(`${this.walletHdpath + index}'`, wallet.ext);
      const wal = CatalystWallet.generateFromSeed(data.key);
      const address: Address = {
        index,
        address: wal.getAddressString(),
        type: wallet.network.name,
      };
      return address;
    }

    /**
     * A method that checks if an address is a valid Ethereum address
     * @param address
     * @param network
     */
    validateAddress(
      address: string,
      network: string,
    ): boolean {
      const web3: any = new this.Web3(this.networks[network].provider);
      return web3.utils.isAddress(address.toLowerCase());
    }

    /**
    * gets the estimated cost of a transaction
    * TODO: only works for bitcoin currently
    * @param network
    */
    getTransactionFee(
      network: string,
    ): Object {
      if (!this.networks[network] || this.networks[network].connect) {
        throw new Error('Invalid network');
      }
      return new Promise((resolve, reject) => {
        const URL: string = this.networks[network].feeApi;
        const gasLimit = 21000;
        const weiMultiplier = 1000000000000000000;
        this.axios.get(URL)
          .then((r: any) => resolve({
            high: r.data.high_gas_price,
            medium: r.data.medium_gas_price,
            low: r.data.low_gas_price,
            txHigh: (r.data.high_gas_price * gasLimit) / weiMultiplier,
            txMedium: (r.data.medium_gas_price * gasLimit) / weiMultiplier,
            txLow: (r.data.low_gas_price * gasLimit) / weiMultiplier,
          }))
          .catch((e: Error) => reject(e.message));
      });
    }

    /**
     * Restore an ethereum keypair using a private key
     * @param wif
     * @param network
     */
    importWIF(
      wif: string,
      network: string,
    ): Object {
      const rawKey: Buffer = Buffer.from(wif, 'hex');
      const keypair = this.ethereumlib.fromPrivateKey(rawKey);
      const result = {
        publicKey: `0x${keypair.getPublicKeyString()}`,
        address: keypair.getChecksumAddressString(),
        privateKey: `0x${keypair.getPrivateKey().toString('hex')}`,
        type: this.networks[network].name,
      };
      return result;
    }

    /**
     *  Create an Ethereum raw transaction
     * @param keypair
     * @param toAddress
     * @param amount
     */
    createEthTx(
      keypair: KeyPair,
      toAddress: string,
      amount: number,
      gasPrice: number,
    ): Object {
      const web3: any = new this.Web3('http://77.68.110.194:5005/api/eth/request');
      return new Promise(async (resolve, reject) => {
        const nonce = await web3.eth.getTransactionCount(keypair.address);
        const sendAmount: string = amount.toString();
        const gasAmount: string = gasPrice.toString();
        const gasLimit = 21004;
        const tx: any = new CatalystTx({
          nonce: `0x${parseInt(nonce, 16)}`,
          gasPrice: web3.utils.toHex(gasAmount),
          gasLimit: web3.utils.toHex(gasLimit),
          to: toAddress,
          value: web3.utils.toHex(web3.utils.toWei(sendAmount)),
          data: '0x0',
        });
        await tx.sign(keypair.privateKey);
        function toHexString(byteArray: Uint8Array) {
          // eslint-disable-next-line no-bitwise
          return Array.prototype.map.call(byteArray, (byte: any) => (`0${(byte & 0xFF).toString(16)}`).slice(-2)).join('');
        }
        const raw = toHexString(tx.serialize());
        const convertToSeconds = 1000;

        const transaction: Transaction = {
          hash: web3.utils.sha3(tx.serialize()),
          fee: web3.utils.fromWei((gasPrice * gasLimit).toString(), 'ether'),
          receiver: toAddress,
          confirmed: false,
          confirmations: 0,
          blockHeight: -1,
          sent: true,
          value: amount,
          sender: keypair.address,
          receivedTime: new Date().getTime() / convertToSeconds,
          confirmedTime: new Date().getTime() / convertToSeconds,
        };

        return resolve({
          transaction,
          hexTx: raw,
        });
      });
    }

    /**
     *  Broadcast an Ethereum transaction
     * @param rawTx
     * @param network
     */
    broadcastTx(
      rawTx: string,
      network: string,
    ): Object {
      const web3 = new this.Web3('http://77.68.110.194:5005/api/eth/request');
      return new Promise(async (resolve, reject) => {
        web3.eth.sendSignedTransaction(rawTx, (err: Error, hash: string) => {
          if (err) return reject(err);
          return resolve({
            hash,
          });
        });
      });
    }


    broadcastProviderTx(
      rawTx: string,
      keypair: KeyPair,
      network: string,
    ): Object {
      const provider = new HDWalletProvider([keypair.privateKey], `http://77.68.110.194:5005/api/eth/request`);
      const web3 = new this.Web3(provider);
      const tx = new CatalystTx(rawTx);
      const deserialized = tx.deserialize();
      const value: any = deserialized.getAmount();
      const gasPrice: any = deserialized.getGasPrice();
      const gasLimit = deserialized.getGasLimit();
      const to: any = deserialized.getReceiverAddress();
      const data: any = deserialized.getData();
      
      return new Promise(async (resolve, reject) => {
        web3.eth.sendTransaction({
          from: keypair.address,
          to: hexStringFromBytes(to),
          value: numberFromBytes(value),
          gasPrice: numberFromBytes(gasPrice),
          gasLimit,
          data: hexStringFromBytes(data),
          }, (err: Error, hash: string) => {
            if (err) return reject(err);
            return resolve({
              hash,
            });
          });
      });
    }
    /**
     *  Verify the signature of an Ethereum transaction object
     * @param tx
     */
    verifyTxSignature(
      tx: any,
    ): boolean {
      const transaction: any = new EthereumTx(tx);
      this.VerifyTx = tx;
      if (transaction.verifySignature()) {
        return true;
      }
      return false;
    }

    /**
     * Gets the transaction history for an array of addresses
     * @param addresses
     * @param network
     * @param startBlock
     * @param endBlock
     */
    getTransactionHistory(
      addresses: string[],
      network: string,
      startBlock: number,
      endBlock?: number,
    )
      : Object {

        const rpc = new ERPC({
          transport: {
            host: '77.68.110.194',
            port: 5005,
            type: 'http',
            path: '/api/eth/request',
          },
        });
        const getBlocks = async (from: number, to: any, erpc: ERPC): Promise<any> => {
          const promises: any[] = [];
        
          for (let i = from; i <= to; i += 1) {
            promises.push(erpc.eth_getBlockByNumber(`0x${i.toString(16)}`, true));
          }
          return Promise.all(promises);
        };
        
        const getTxs = async (txHashes: any[], erpc: ERPC): Promise<any[]> => {
          const promises: any[] = [];
          txHashes.forEach((hash: any) => {
            promises.push(erpc.eth_getTransactionByHash(hash));
          });
          const txs = Promise.all(promises);
          console.log(txs);
          return txs;
        };

        const fetchTxs = async (address: any) => {
          const txHashes: any = [];
          const txTimestamps: any = {};
          let min = startBlock;
          let max = endBlock;
          if(!endBlock) {
            const height: any = await rpc.eth_blockNumber()
            min = (height >= 100) ? (height - 100) : 0;
            max = height
          }
          const deltas = await getBlocks(min, max, rpc);
          const blocks = deltas.filter((x: any) => x);
          blocks.forEach(({transactions, timestamp}: {transactions: any, timestamp: number}) => {
            console.log(transactions);
            if(transactions.length > 0){
              txHashes.push(...transactions);
              transactions.forEach((tx: any) => {
                txTimestamps[tx] = timestamp;
              });
            };
          });

          const txs = await getTxs(txHashes, rpc);
          return txs.reduce((filtered, tx) => {
            if(tx.from === addresses[0] || tx.to === address) {
              tx.timestamp = txTimestamps[tx.hash];
              filtered.push(tx);
            }
            return filtered
          }, []);
        }

      const transactions: Transaction[] = [];
      const minConfirmations = 1;
      const weiMultiplier = 1000000000000000000;
      const gweiMultiplier = 1000000000;
      const getHistory = async (address: string) => {
        const txs = await fetchTxs(address);

            txs.forEach((r: any) => {
              let receiver: string = r.to;
              let sent: boolean = false;
              let confirmed: boolean = false;
              let contractCall: boolean = false;

              if (r.from === address.toLowerCase()) {
                sent = true;
              }
              if (r.confirmations >= minConfirmations) {
                confirmed = true;
              }
              if (!r.to) {
                receiver = r.contractAddress;
                contractCall = true;
              }

              const transaction: Transaction = {
                sent,
                receiver,
                contractCall,
                confirmed,
                hash: r.hash,
                blockHeight: parseInt(r.blockNumber, 16),
                fee: (parseInt(r.gas, 16) * parseInt(r.gasPrice, 16) / weiMultiplier).toString(),
                value: parseInt(r.value ,16) / weiMultiplier,
                sender: r.from,
                receivedTime: parseInt(r.timestamp, 16),
                confirmedTime: parseInt(r.timestamp, 16),
                confirmations: 1,
              };

              transactions.push(transaction);
            });
          };

      
      return new Promise(async (resolve, reject) => {
        const promises: Promise<Object>[] = [];
        addresses.forEach(async (address: string) => {
          promises.push(
            new Promise(async (res, rej) => res(getHistory(address))),
          );
        });
        try {
          await Promise.all(promises);
        } catch (e) { return reject(e); }

        const history: object = {
          addresses,
          totalTransactions: transactions.length,
          txs: transactions,

        };

        return resolve(history);
      });
    }

    /**
     * Gets the total balance of an array of addresses
     * @param addresses
     * @param network
     */
    getBalance(
      addresses: string[],
      network: string,
    ): Object {
      const rpc = new ERPC({
        transport: {
          host: '77.68.110.194',
          port: 5005,
          type: 'http',
          path: '/api/eth/request',
        },
      });
      let balance: any = 0;
      const promises: Promise<object>[] = [];

      const weiMultiplier = 1000000000000000000;

      const getAddrBalance = (addr: string) => new Promise(async (resolve, reject) => {
        const bal = await rpc.eth_getBalance(addr);
        resolve(bal ? (parseInt(bal, 16) / weiMultiplier) : 0);
      });

      return getAddrBalance(addresses[0]);      
      // return new Promise(async (resolve, reject) => {
      //   addresses.forEach((addr) => {
      //     promises.push(
      //       new Promise(async (res, rej) => res(getAddrBalance(addr))),
      //     );
      //   });
      //   try {
      //     await Promise.all(promises);
      //   } catch (e) { return reject(e); }
      //   const weiMultiplier = 1000000000000000000;
      //   // const dust = 1000000000000;
      //   // if (balance < dust) return resolve(0);
      //   return resolve(parseInt(balance, 16) / weiMultiplier);
      // });
    }

    /**
     * Generates the first 10 accounts of an ethereum wallet
     * @param entropy
     * @param network
     * @param internal
     */
    accountDiscovery(
      wallet: Wallet,
      internal?: boolean,
    ): Object {
      const accounts: Address[] = [];
      const numberOfAccounts = 10;
      for (let i: number = 0; i < numberOfAccounts; i += 1) {
        const key: KeyPair = this.generateKeyPair(wallet, i);
        const account: Address = {
          address: key.address,
          index: i,
          type: wallet.network.name,
        };
        accounts.push(account);
      }
      return accounts;
    }
  }
}

export default CryptoWallet.SDKS.Catalyst.CatalystSDK;
