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


    private ethereumlib = EthereumLib;

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
     * @param wif
     */
    importWIF(wif: string): Object {
      const rawKey = Buffer.from(wif, 'hex');
      const keypair = this.ethereumlib.fromPrivateKey(rawKey);
      const result = {
        publicKey: `0x${keypair.getPublicKeyString()}`,
        address: keypair.getChecksumAddressString(),
        privateKey: `0x${keypair.getPrivateKey().toString('hex')}`,
        type: 'Ethereum',
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
            chainId: 3,
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
      this.VerifyTx = tx;
      if (tx.verifySignature()) {
        return true;
      }
      return false;
    }

    getTransactionHistory(
      address: string,
      addresses: string[],
      network: string,
      lastBlock: number,
      beforeBlock?: number,
      limit?: number,
    )
      : Object {
      return new Promise(async (resolve, reject) => {
        const URL = `http://api-ropsten.etherscan.io/api?module=account&action=txlist&address=
        ${address}&startblock=${lastBlock}&sort=desc&apikey=${this.networks.ethToken}`;

        await this.axios.get(URL)
          .then(async (res: any) => {
            if (!res.data.result) {
              return resolve();
            }

            const transactions: any = [];

            const nextBlock: number = 0; // res.data.result[0].blockNumber
            res.data.result.forEach((r: any) => {
              let receiver = r.to;
              let sent = false;
              let confirmed = false;
              let contractCall = false;

              if (r.from === address.toLowerCase()) {
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
            let balance = 0;
            await this.axios.get(
              `https://api-ropsten.etherscan.io/api?module=account&action=balance&address=
              ${address}&tag=latest&apikey=${this.networks.ethToken}`,
            )

              .then((bal: any) => {
                balance = bal.data.result;
              });
            const history = {
              address,
              balance,
              nextBlock,
              totalTransactions: transactions.length,
              txs: transactions,

            };

            return resolve(history);
          });
      });
    }

    getWalletHistory(
      addresses: string[],
      network: string,
      lastBlock: number,
      full?: boolean,
    )
      : Object {
      const result: any = [];

      return new Promise((resolve, reject) => {
        const promises: any = [];

        addresses.forEach((address: any) => {
          promises.push(

            new Promise(async (res, rej) => {
              const history: any = await this.getTransactionHistory(
                address, addresses, network, 0, lastBlock,
              );

              if (history.totalTransactions > 0) {
                result.push(history);
              }
              res();
            }),
          );
        });

        Promise.all(promises).then(() => {
          resolve(result);
        });
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
