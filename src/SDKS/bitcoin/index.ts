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
     * @param keyPair
     */
    generateSegWitAddress(keyPair: any): Object {
      const key = this.bitcoinlib.ECPair.fromWIF(keyPair.privateKey, keyPair.network.connect);
      const { address } = this.bitcoinlib.payments.p2wpkh(
        {
          pubkey: key.publicKey,
          network: keyPair.network.connect,
        },
      );
      return address;
    }

    /**
     *
     * @param keyPair
     */
    generateSegWitP2SH(keyPair: any): Object {
      const key = this.bitcoinlib.ECPair.fromWIF(keyPair.privateKey, keyPair.network.connect);
      return this.bitcoinlib.payments.p2sh({
        redeem: this.bitcoinlib.payments.p2wpkh(
          {
            pubkey: key.publicKey,
            network: keyPair.network.connect,
          },
        ),
        network: keyPair.network.connect,
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
        const apiUrl = this.networks[network].discovery;
        const URL = `${apiUrl}/addrs/${addresses.toString()}/utxo`;
        console.log('URL :', URL);
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
          });
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
  }
}
export default CryptoWallet.SDKS.Bitcoin.BitcoinSDK;
