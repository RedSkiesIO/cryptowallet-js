import GenericSDK from '../GenericSDK'
import * as IBitcoinSDK from './IBitcoinSDK'
import BitcoinLib from 'bitcoinjs-lib'

namespace CryptoWallet.SDKS.Bitcoin {
  export class BitcoinSDK extends GenericSDK implements IBitcoinSDK.CryptyoWallet.SDKS.Bitcoin.IBitcoinSDK {




    /**
    *
    * @param wallet
    * @param index
    * @param external
    */
    generateKeyPair(wallet: any, index: number, internal?: boolean): Object {
      let node = wallet.externalNode
      if (internal) { node = wallet.internalNode }
      const addrNode = node.deriveChild(index)
      const { address } = this.bitcoinlib.payments.p2sh({
        redeem: this.bitcoinlib.payments.p2wpkh({ pubkey: addrNode.publicKey, network: wallet.network }),
        network: wallet.network
      })

      const keypair =
      {
        publicKey: addrNode.publicKey.toString('hex'),
        address: address,
        privateKey: this.wif.encode(wallet.network.wif, addrNode.privateKey, true),
        derivationPath: `m/49'/${wallet.type}'/0'/0/${index}`,
        type: wallet.network.name,
        network: wallet.network
      }

      return keypair

    }


    /**
     *
     * @param keyPair
     */
    generateSegWitAddress(keyPair: any): Object {
      return this.bitcoinlib.payments.p2wpkh({ pubkey: keyPair.publicKey })
    }

    /**
     *
     * @param keyPair
     */
    generateSegWitP2SH(keyPair: any): Object {
      return this.bitcoinlib.payments.p2sh({
        redeem: this.bitcoinlib.payments.p2wpkh({ pubkey: keyPair.publicKey })
      })
    }

    /**
     *
     * @param key1
     * @param key2
     * @param key3
     * @param key4
     */
    generateSegWit3of4MultiSigAddress(key1: string, key2: string, key3: string, key4: string): Object {
      const pubkeys: Array<any> = [key1, key2, key3, key4].map((hex) => Buffer.from(hex, 'hex'))
      return this.bitcoinlib.payments.p2wsh({
        redeem: this.bitcoinlib.payments.p2ms({ m: 3, pubkeys })
      })
    }

    /**
     *
     * @param wif
     */
    importWIF(wif: string): Object {
      const keyPair = this.bitcoinlib.ECPair.fromWIF(wif)
      const { address } = this.bitcoinlib.payments.p2sh({
        redeem: this.bitcoinlib.payments.p2wpkh({ pubkey: keyPair.publicKey })
      })
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
      })
    }


    createRawTx(options: any): Object {
      const txb = new this.bitcoinlib.TransactionBuilder(this.bitcoinlib.networks.testnet)
      txb.setVersion(1)
      txb.addInput(options.txid, options.vout)
      txb.addOutput(options.sendTo, options.amountToSend)
      txb.addOutput(options.changeAddress, options.change)
      txb.sign(0, options.keyPair)
      return txb.build().toHex()
    }

    /**
     *
     * @param transaction
     */
    verifyTxSignature(transaction: any): boolean {
      const keyPairs = transaction.pubKeys.map((q: any) => {
        return this.bitcoinlib.ECPair.fromPublicKey(Buffer.from(q, 'hex'))
      })

      const tx = this.bitcoinlib.Transaction.fromHex(transaction.txHex)
      const valid: Array<boolean> = []
      tx.ins.forEach((input: any, i: number) => {
        const keyPair = keyPairs[i]
        const p2pkh = this.bitcoinlib.payments.p2pkh({
          pubkey: keyPair.publicKey,
          input: input.script
        })

        const ss = this.bitcoinlib.script.signature.decode(p2pkh.signature)
        const hash = tx.hashForSignature(i, p2pkh.output, ss.hashType)
        valid.push(hash === ss.signature)
      })
      return valid.every(item => item === true)
    }

    /**
     *
     */
    create1t1tx(keypair: any, txHash: string, txNumber: number, address: string, amount: number): String {
      const txb = new this.bitcoinlib.TransactionBuilder()

      txb.setVersion(1)
      txb.addInput(txHash, txNumber)
      txb.addOutput(address, amount)
      txb.sign(0, keypair)

      return txb.build().toHex()
    }

    /**
     *
     */
    create2t2tx(txparams: any): String {
      const txb = new this.bitcoinlib.TransactionBuilder()
      txb.setVersion(1)
      txb.addInput(txparams.txHash1, txparams.txNumber1)
      txb.addInput(txparams.txHash2, txparams.txNumber2)

      txb.addOutput(txparams.address1, txparams.amount1)
      txb.addOutput(txparams.address2, txparams.amount2)

      txb.sign(0, txparams.keypair1)
      txb.sign(1, txparams.keypair2)

      return txb.build().toHex()
    }
  }
}
export default CryptoWallet.SDKS.Bitcoin.BitcoinSDK
