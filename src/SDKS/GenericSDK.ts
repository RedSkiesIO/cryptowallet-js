/* eslint-disable import/no-unresolved */
// /<reference path="../../types/module.d.ts" />
import * as Bip39 from 'bip39';
import * as Bip44hdkey from 'hdkey';
import * as Bitcoinlib from 'bitcoinjs-lib';
import * as Wif from 'wif';
import * as Request from 'request';
import * as Axios from 'axios';
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
      if (cointype === 0 || cointype === 1) {
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

    generateKeyPair(wallet: any, index: number, external?: boolean): Object {
      let node = wallet.externalNode;
      if (!external) { node = wallet.internalNode; }
      const addrNode = node.deriveChild(index);
      const { address } = this.bitcoinlib.payments.p2sh({
        redeem: this.bitcoinlib.payments.p2wpkh(
          { pubkey: addrNode.publicKey, network: wallet.network },
        ),
      });

      return [
        {
          address,
          publicKey: addrNode.publicKey,
          privateKey: addrNode.privateKey,
          derivationPath: `m/${wallet.bip}'/${wallet.type}'/0'/0/${index}`,
          type: wallet.network.name,
        },
      ];
    }

    abstract broadcastTx(rawTx: object, network: string): Object;

    abstract importWIF(wif: string): Object;

    // abstract createRawTx(
    // accounts: object[],
    // change: string,
    // utxos: any,
    // network: string,
    // toAddress: string,
    // amount: number): Object;

    abstract verifyTxSignature(transaction: object): boolean;

    abstract accountDiscovery(entropy: string, netork: string): Object;

    // abstract getUTXOs(addresses: String[], network: string): Object;

    getWalletHistory(
      addresses: string[],
      network: string,
      lastBlock: number,
      full?: boolean,
    ): Object {
      const result: any = [];
      return new Promise((resolve, reject) => {
        const promises: any = [];

        addresses.forEach((address: any) => {
          promises.push(
            new Promise(async (res, rej) => {
              if (full) {
                const history: any = await this.getTransactionHistory(address,
                  addresses,
                  network,
                  lastBlock,
                  undefined, 50);

                if (typeof history === 'undefined') {
                  return res();
                }

                if (history.hasMore) {
                  let more = true;
                  let lBlock = history.lastBlock;
                  while (more) {
                    // eslint-disable-next-line no-await-in-loop
                    const nextData: any = await this.getTransactionHistory(
                      address, addresses, network, 0, lBlock,
                    );
                    nextData.txs.forEach((tx: any) => {
                      history.txs.push(tx);
                    });
                    if (typeof nextData.hasMore === 'undefined') { more = false; }
                    lBlock = nextData.lastBlock;
                  }
                }
                result.push(history);
              } else {
                const history = await this.getTransactionHistory(
                  address, addresses, network, lastBlock,
                );
                result.push(history);
              }
              return res();
            }),
          );
        });
        Promise.all(promises).then(() => {
          resolve(result);
        });
      });
    }

    getTransactionHistory(
      address: string,
      addresses: string[],
      network: string,
      lastBlock: number,
      beforeBlock?: number,
      limit?: number,
    ): Object {
      const apiUrl = this.networks[network].getTranApi;
      let returnAmount = 10;
      if (limit != null) { returnAmount = limit; }
      let URL = `${apiUrl + address}/full?${this.networks.token}&after=${lastBlock}&limit=${returnAmount}`;

      if (beforeBlock != null) {
        URL = `${apiUrl + address}/full?${this.networks.token}&before=${lastBlock}&limit=${returnAmount}`;
      }

      return new Promise((resolve, reject) => {
        this.axios.get(URL)
          .then((r: any) => {
            if (r.data.txs.length === 0) { return resolve(); }
            const more: boolean = r.data.hasMore;
            const results = r.data.txs;
            const transactions: any = [];
            const oldestBlock: number = results[results.length - 1].block_height - 1;

            results.forEach((result: any) => {
              let confirmed = false;
              if (result.confirmations > 5) { confirmed = true; }
              let sent: boolean = false;
              let value: number = 0;
              let change: number = 0;
              const receivers: any = [];
              const senders: any = [];

              result.inputs.forEach((input: any) => {
                const inputAddr = input.addresses;
                inputAddr.forEach((addr: any) => {
                  if (addr === address) {
                    sent = true;
                  }
                  senders.push(addr);
                });
              });
              result.outputs.forEach((output: any) => {
                const outputAddr = output.addresses;
                outputAddr.forEach((addr: any) => {
                  if (sent && !addresses.includes(addr)) {
                    receivers.push(addr);
                    value += output.value;
                  } else if (!sent && addresses.includes(addr)) {
                    ({ value } = output);
                    receivers.push(addr);
                  } else {
                    change = output.value;
                  }
                });
              });

              const transaction = {
                sent,
                value,
                change,
                confirmed,
                hash: result.hash,
                blockHeight: result.block_height,
                fee: result.fees,
                sender: senders,
                receiver: receivers,
                receivedTime: result.received,
                confirmedTime: result.confirmed,
              };
              transactions.push(transaction);
            });

            const history = {
              more,
              address: r.data.address,
              balance: r.data.balance,
              unconfirmedBalance: r.data.unconfirmed_balance,
              finalBalance: r.data.final_balance,
              totalTransactions: r.data.n_tx,
              finalTotalTransactions: r.data.final_n_tx,
              lastBlock: oldestBlock,
              txs: transactions,
            };

            return resolve(history);
          })
          .catch((error: any) => reject(error));
      });
    }
  }

}

export default CryptoWallet.SDKS.GenericSDK;
