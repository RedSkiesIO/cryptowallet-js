// /<reference path="../../types/module.d.ts" />
import * as ISDK from './ISDK'
import * as Networks from './networks'
import * as IWIF from './IWIF'
import * as Bip39 from 'bip39'
import * as Bip44hdkey from 'hdkey'
import * as Bitcoinlib from 'bitcoinjs-lib'
import * as Wif from 'wif'

export namespace CryptoWallet.SDKS {
  export abstract class GenericSDK implements ISDK.CryptoWallet.SDKS.ISDK {
    bitcoinlib = Bitcoinlib
    networks: any = Networks
    bip39: any = Bip39
    wif: any = Wif

    generateHDWallet(entropy: string, network: string): Object {
      const cointype = this.networks[network].bip
      const root = Bip44hdkey.fromMasterSeed(this.bip39.mnemonicToSeed(entropy))// root of node tree
      let externalNode, internalNode, bip
      if (cointype === 0 || cointype === 1) {
        externalNode = root.derive(`m/49'/${cointype}'/0'/0`)
        internalNode = root.derive(`m/49'/${cointype}'/0'/1`)// needed for bitcoin
        bip = 49
      } else {
        externalNode = root.derive(`m/44'/${cointype}'/0'/0`)
        internalNode = root.derive(`m/44'/${cointype}'/0'/1`)// needed for bitcoin
        bip = 44
      }
      const wallet: object = {
        mnemonic: entropy,
        privateKey: root.privateExtendedKey,
        externalNode,
        internalNode,
        bip,
        type: cointype,
        network: this.networks[network]
      }

      return wallet
    };

    generateKeyPair(wallet: any, index: number): Object {
      let node = wallet.externalNode
      if (!external) { node = wallet.internalNode }
      const addrNode = node.deriveChild(index)
      const { address } = this.bitcoinlib.payments.p2sh({
        redeem: this.bitcoinlib.payments.p2wpkh({ pubkey: addrNode.publicKey, network: wallet.network })
      })

      return [
        {
          publicKey: addrNode.publicKey,
          address: address,
          privateKey: addrNode.privateKey,
          derivationPath: `m/${wallet.bip}'/${wallet.type}'/0'/0/${index}`,
          type: wallet.network.name
        }
      ]
    };

    abstract broadcastTx(rawTx: object, network: string): Object;

    abstract importWIF(wif: string): Object;

    abstract gernerateP2SHMultiSig(keys: Array<string>): Object;

    abstract createRawTx(keypair: any, toAmount: String, amount: number): Object;

    abstract verifyTxSignature(transaction: object): boolean;

    abstract create1t1tx(keypair: any, txHash: string, txNumber: number, address: string, amount: number): String;

    abstract create2t2tx(txparams: any): String;
  }

}

export default CryptoWallet.SDKS.GenericSDK
