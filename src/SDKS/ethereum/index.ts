/* eslint-disable import/no-unresolved */
// eslint-disable-next-line spaced-comment
///<reference path="../../types/module.d.ts" />
import * as bip44hdkey from 'ethereumjs-wallet/hdkey';
import * as EthereumLib from 'ethereumjs-wallet';
import * as EthereumTx from 'ethereumjs-tx';
import * as Web3 from 'web3';
import GenericSDK from '../GenericSDK';
import * as IEthereumSDK from './IEthereumSDK';

export namespace CryptoWallet.SDKS.Ethereum {
  export class EthereumSDK extends GenericSDK
    implements IEthereumSDK.CryptyoWallet.SDKS.Ethereum.IEthereumSDK {
    Bip = bip44hdkey

    ethereumlib = EthereumLib;

    Web3: any = Web3;

    VerifyTx: any;

    /**
     *
     * @param wallet
     * @param index
     */
    generateKeyPair(wallet: any, index: number): Object {
      const addrNode = this.Bip.fromExtendedKey(
        wallet.externalNode.privateExtendedKey,
      ).deriveChild(index);
      const keypair = {
        publicKey: addrNode.getWallet().getPublicKeyString(),
        address: addrNode.getWallet().getChecksumAddressString(),
        derivationPath: `m/44'/60'/0'/0/${index}`,
        privateKey: addrNode.getWallet().getPrivateKeyString(),
        type: 'Ethereum',
        network: wallet.network,
      };
      return keypair;
    }

    /**
         *
         * @param wallet
         * @param index
         */
    generateAddress(wallet: any, index: number): Object {
      const addrNode = this.Bip.fromExtendedKey(
        wallet.externalNode.privateExtendedKey,
      ).deriveChild(index);
      const address = {
        index,
        address: addrNode.getWallet().getChecksumAddressString(),
        type: wallet.name,
      };
      return address;
    }

    validateAddress(address: string, network: string): boolean {
      const web3 = new this.Web3(new Web3.providers.HttpProvider(this.networks[network].provider));
      return web3.utils.isAddress(address);
    }

    /**
     *
     * @param wif
     */
    importWIF(wif: string, network: string): Object {
      const rawKey = Buffer.from(wif, 'hex');
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
     *
     * @param keypair
     * @param toAddress
     * @param amount
     */
    createEthTx(keypair: any, toAddress: String, amount: number): Object {
      const privateKey = Buffer.from(keypair.privateKey.substr(2), 'hex');

      const web3 = new this.Web3(new Web3.providers.HttpProvider(keypair.network.provider));
      return new Promise((resolve, reject) => {
        web3.eth.getTransactionCount(keypair.address, (err: any, nonce: any) => {
          if (err) {
            return reject(err);
          }
          const sendAmount = amount.toString();
          const tx = new EthereumTx({
            nonce,
            gasPrice: web3.utils.toHex(web3.utils.toWei('20', 'gwei')),
            gasLimit: web3.utils.toHex(100000),
            to: toAddress,
            value: web3.utils.toHex(web3.utils.toWei(sendAmount)),
            chainId: keypair.network.chainId,
          });
          tx.sign(privateKey);
          const raw = `0x${tx.serialize().toString('hex')}`;

          return resolve(raw);
        });
      });
    }

    /**
     *
     * @param rawTx
     * @param network
     */
    broadcastTx(rawTx: object, network: string): Object {
      const web3 = new Web3(new Web3.providers.HttpProvider(this.networks[network].provider));
      return new Promise((resolve, reject) => {
        web3.eth.sendSignedTransaction(rawTx, (err: any, result: any) => {
          if (err) return console.log('error', err);
          console.log('sent', result);
          return resolve(result);
        });
      });
    }

    /**
     *
     * @param tx
     */
    verifyTxSignature(tx: any): boolean {
      const transaction = new EthereumTx(tx);
      this.VerifyTx = tx;
      if (transaction.verifySignature()) {
        return true;
      }
      return false;
    }

    getTransactionHistory(
      addresses: string[],
      network: string,
      startBlock: number,
      endBlock?: number,
    )
      : Object {
      const transactions: any = [];
      const getHistory = (address: string) => new Promise(async (resolve, reject) => {
        const URL = `${this.networks[network].getTranApi
          + address}&startblock=${startBlock}&sort=desc&apikey=${this.networks.ethToken}`;

        await this.axios.get(URL)
          .then(async (res: any) => {
            if (!res.data.result) {
              return resolve();
            }

            res.data.result.forEach((r: any) => {
              let receiver = r.to;
              let sent = false;
              let confirmed = false;
              let contractCall = false;

              if (r.from === addresses[0].toLowerCase()) {
                sent = true;
              }
              if (r.confirmations > 11) {
                confirmed = true;
              }
              if (!r.to) {
                receiver = r.contractAddress;
                contractCall = true;
              }

              const transaction = {
                sent,
                receiver,
                contractCall,
                confirmed,
                hash: r.hash,
                blockHeight: r.blockNumber,
                fee: r.cumulativeGasUsed,
                value: r.value,
                sender: r.from,
                confirmedTime: r.timeStamp,
              };

              transactions.push(transaction);
            });

            return resolve();
          });
      });
      return new Promise(async (resolve, reject) => {
        const promises: Promise<Object>[] = [];
        addresses.forEach(async (address: string) => {
          promises.push(
            new Promise(async (res, rej) => res(getHistory(address))),
          );
        });
        await Promise.all(promises);
        const history = {
          addresses,
          totalTransactions: transactions.length,
          txs: transactions,

        };

        return resolve(history);
      });
    }

    getBalance(addresses: string[], network: string): Object {
      let balance = 0;
      const promises: any = [];

      const getAddrBalance = (addr: string) => new Promise(async (resolve, reject) => {
        await this.axios.get(
          `${this.networks[network].getBalanceApi + addr}
    &tag=latest&apikey=${this.networks.ethToken}`,
        )
          .then((bal: any) => {
            balance += bal.data.result;
            resolve();
          });
      });

      return new Promise(async (resolve, reject) => {
        addresses.forEach((addr) => {
          promises.push(
            new Promise(async (res, rej) => res(getAddrBalance(addr))),
          );
        });
        await Promise.all(promises);
        return balance;
      });
    }

    accountDiscovery(entropy: string, network: string, internal?: boolean): Object {
      const wallet = this.generateHDWallet(entropy, network);

      const accounts = [];

      for (let i: number = 0; i < 10; i += 1) {
        const key: any = this.generateKeyPair(wallet, i);
        const account = {
          address: key.address,
          index: i,
        };
        accounts.push(account);
      }

      return accounts;
    }
  }
}

export default CryptoWallet.SDKS.Ethereum.EthereumSDK;
