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
     * generate an ethereum keypair using a HD wallet object
     * @param wallet
     * @param index
     */
    generateKeyPair(wallet: any, index: number): Object {
      const addrNode = this.Bip.fromExtendedKey(
        wallet.external.xpriv,
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
    * generates an etherum address using a HD wallet object
    * @param wallet
    * @param index
    */
    generateAddress(wallet: any, index: number): Object {
      const addrNode = this.Bip.fromExtendedKey(
        wallet.external.xpriv,
      ).deriveChild(index);
      const address = {
        index,
        address: addrNode.getWallet().getChecksumAddressString(),
        type: wallet.name,
      };
      return address;
    }

    /**
     * A method that checks if an address is a valid Ethereum address
     * @param address
     * @param network
     */
    validateAddress(address: string, network: string): boolean {
      const web3 = new this.Web3(this.networks[network].provider);
      return web3.utils.isAddress(address.toLowerCase());
    }

    /**
    * gets the estimated cost of a transaction
    * TODO: only works for bitcoin currently
    * @param network
    */
    getTransactionFee(network: string): Object {
      return new Promise((resolve, reject) => {
        // if (this.networks[network].connect) {
        //   throw new Error('Invalid network type');
        // }
        const URL = this.networks[network].feeApi;
        this.axios.get(URL)
          .then((r: any) => resolve({
            high: r.data.high_gas_price,
            medium: r.data.medium_gas_price,
            low: r.data.low_gas_price,
            txHigh: (r.data.high_gas_price * 21000) / 1000000000000000000,
            txMedium: (r.data.medium_gas_price * 21000) / 1000000000000000000,
            txLow: (r.data.low_gas_price * 21000) / 1000000000000000000,
          }))
          .catch((e: any) => reject(new Error(`Failed to get transaction fee: ${e.message}`)));
      });
    }

    /**
     * Restore an ethereum keypair using a private key
     * @param wif
     * @param network
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
     *  Create an Ethereum raw transaction
     * @param keypair
     * @param toAddress
     * @param amount
     */
    createEthTx(keypair: any, toAddress: String, amount: number, gasPrice: number): Object {
      const privateKey = Buffer.from(keypair.privateKey.substr(2), 'hex');

      const web3 = new this.Web3(keypair.network.provider);
      return new Promise((resolve, reject) => {
        web3.eth.getTransactionCount(keypair.address, (err: any, nonce: any) => {
          if (err) {
            return reject(new Error(err));
          }
          const sendAmount = amount.toString();
          const gasAmount = gasPrice.toString();
          const tx = new EthereumTx({
            nonce,
            gasPrice: web3.utils.toHex(gasAmount),
            gasLimit: web3.utils.toHex(21000),
            to: toAddress,
            value: web3.utils.toHex(web3.utils.toWei(sendAmount)),
            chainId: keypair.network.chainId,
          });
          tx.sign(privateKey);
          const raw: any = `0x${tx.serialize().toString('hex')}`;

          const transaction = {
            hash: web3.utils.sha3(raw),
            fee: web3.utils.fromWei((gasPrice * 21000).toString(), 'ether'),
            receiver: toAddress,
            confirmed: false,
            confirmations: 0,
            blockHeight: -1,
            sent: true,
            value: amount,
            sender: keypair.address,
            receivedTime: new Date().getTime() / 1000,
            confirmedTime: new Date().getTime() / 1000,

          };

          return resolve({
            transaction,
            hexTx: raw,
          });
        })
          .catch((e: any) => reject(e));
      });
    }

    /**
     *  Broadcast an Ethereum transaction
     * @param rawTx
     * @param network
     */
    broadcastTx(rawTx: object, network: string): Object {
      const web3 = new this.Web3(this.networks[network].provider);
      return new Promise((resolve, reject) => {
        web3.eth.sendSignedTransaction(rawTx, (err: any, hash: any) => {
          if (err) return reject(err);
          return resolve({
            hash,
          });
        })
          .catch((e: any) => reject(e));
      });
    }

    /**
     *  Verify the signature of an Ethereum transaction object
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
                fee: r.cumulativeGasUsed / 1000000000,
                value: r.value / 1000000000000000000,
                sender: r.from,
                confirmedTime: r.timeStamp,
                confirmations: r.confirmations,
              };

              transactions.push(transaction);
            });

            return resolve();
          })
          .catch((e: any) => reject(e));
      });
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

        const history = {
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
    getBalance(addresses: string[], network: string): Object {
      let balance = 0;
      const promises: any = [];


      const getAddrBalance = (addr: string) => new Promise(async (resolve, reject) => {
        const URL = `${this.networks[network].getBalanceApi + addr}&tag=latest&apikey=${this.networks.ethToken}`;
        await this.axios.get(URL)
          .then((bal: any) => {
            balance += bal.data.result;
            resolve();
          })
          .catch((e: any) => reject(e));
      });

      return new Promise(async (resolve, reject) => {
        addresses.forEach((addr) => {
          promises.push(
            new Promise(async (res, rej) => res(getAddrBalance(addr))),
          );
        });
        try {
          await Promise.all(promises);
        } catch (e) { return reject(e); }
        if (balance < 1000000000000) return resolve(0);
        return resolve(balance / 1000000000000000000);
      });
    }

    /**
     * Generates the first 10 accounts of an ethereum wallet
     * @param entropy
     * @param network
     * @param internal
     */
    accountDiscovery(wallet: any, network: string, internal?: boolean): Object {
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
