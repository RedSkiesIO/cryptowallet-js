import GenericSDK from '../GenericSDK';;
import * as IBitcoinSDK from './IBitcoinSDK';
import BitcoinLib from 'bitcoinjs-lib';

namespace CryptoWallet.SDKS.Bitcoin {
  export class BitcoinSDK extends GenericSDK implements IBitcoinSDK.CryptyoWallet.SDKS.Bitcoin.IBitcoinSDK {

    private bitcoinlib = BitcoinLib;

    /**
    * 
    * @param entropy 
    * @param cointype 
    * @param testnet 
    */
    generateHDWallet(entropy: any, cointype: number, testnet?: boolean): Object {
      let type: number = 0;
      if (testnet) {
        type = 1;
      };
      let wallet: any = super.generateHDWallet(entropy, type);
      wallet.privateKey = wallet.root.privateKey.toString('hex');
      return {
        privateKey: wallet.root.privateKey.toString('hex'),
        mnemonic: wallet.mnemonic,
        wallet,
        externalAddresses: this.generateKeyPair(wallet, 0),
        internalAddresses: this.generateKeyPair(wallet, 0, false)
      };
    }

    /**
     * 
     * @param wallet 
     * @param index 
     * @param external 
     */
    generateKeyPair(wallet: any, index: number, external?: boolean): Object {
      let node = wallet.externalNode;
      if (!external) { node = wallet.internalNode }
      const addrNode = node.deriveChild(index);
      const { address } = this.bitcoinlib.payments.p2sh({
        redeem: this.bitcoinlib.payments.p2wpkh({ pubkey: addrNode.publicKey })
      })

      return [
        {
          publicKey: addrNode.publicKey,
          address: address,
          privateKey: addrNode.privateKey,
          derivationPath: `m/49'/0'/0'/0/${index}`,
          type: 'STANDARD'
        }
      ]
    }

    /**
     * 
     * @param keyPair 
     */
    generateSegWitAddress(keyPair: any): Object {
      return this.bitcoinlib.payments.p2wpkh({ pubkey: keyPair.publicKey });
    }

    /**
     * 
     * @param keyPair 
     */
    generateSegWitP2SH(keyPair: any): Object {
      return this.bitcoinlib.payments.p2sh({
        redeem: this.bitcoinlib.payments.p2wpkh({ pubkey: keyPair.publicKey })
      });
    }

    /**
     * 
     * @param key1 
     * @param key2 
     * @param key3 
     * @param key4 
     */
    generateSegWit3of4MultiSigAddress(key1: string, key2: string, key3: string, key4: string): Object {
      const pubkeys: Array<any> = [key1, key2, key3, key4].map((hex) => Buffer.from(hex, 'hex'));
      return this.bitcoinlib.payments.p2wsh({
        redeem: this.bitcoinlib.payments.p2ms({ m: 3, pubkeys })
      });
    }

    /**
     * 
     * @param wif 
     */
    importWIF(wif: string): Object {
      const keyPair = this.bitcoinlib.ECPair.fromWIF(wif)
      const { address } = this.bitcoinlib.payments.p2pkh({ pubkey: keyPair.publicKey })
      return address;
    }

    /**
     * 
     * @param keys 
     */
    gernerateP2SHMultiSig(keys: Array<string>): Object {
      const pubkeys: Array<any> = keys.map((hex) => Buffer.from(hex, 'hex'))
      return this.bitcoinlib.payments.p2sh({
        redeem: this.bitcoinlib.payments.p2ms({ m: pubkeys.length, pubkeys })
      });
    }

    /**
     * 
     * @param options 
     */
    createTX(options: any): Object {
      const txb = new this.bitcoinlib.TransactionBuilder();
      txb.setVersion(1);
      txb.addInput(options.input, 0);
      txb.addOutput(options.output, options.outputValue);
      txb.sign(0, options.keyPair);
      return txb.build().toHex();
    }

    /**
     * 
     * @param transaction 
     */
    verifyTxSignature(transaction: any): boolean {
      const keyPairs = transaction.pubKeys.map((q: any) => {
        return this.bitcoinlib.ECPair.fromPublicKey(Buffer.from(q, 'hex'));
      });

      const tx = this.bitcoinlib.Transaction.fromHex(transaction.txHex);
      const valid: Array<boolean> = [];
      tx.ins.forEach((input: any, i: number) => {
        const keyPair = keyPairs[i]
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
    create1t1tx(): Object {
      throw new Error("Method not implemented.");
    }

    /**
     * 
     */
    create2t2tx(): Object {
      throw new Error("Method not implemented.");
    }
  }
}
export default CryptoWallet.SDKS.Bitcoin.BitcoinSDK;