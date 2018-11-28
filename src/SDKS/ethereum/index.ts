///<reference path="../../types/module.d.ts" />
import GenericSDK from '../GenericSDK'
import * as IWIF from '../IWIF'
import * as IEthereumSDK from './IEthereumSDK'
import * as bip44hdkey from 'ethereumjs-wallet/hdkey'
import * as EthereumLib from 'ethereumjs-wallet'
import * as EthereumTx from 'ethereumjs-tx'

export namespace CryptoWallet.SDKS.Ethereum {
  export class EthereumSDK extends GenericSDK implements IEthereumSDK.CryptyoWallet.SDKS.Ethereum.IEthereumSDK {
    private ethereumlib = EthereumLib;

    /**
     *
     * @param entropy
     * @param cointype
     */
    generateHDWallet(entropy: string): Object {
      return super.generateHDWallet(entropy, 'ETHEREUM');
    }

    /**
     *
     * @param wallet
     * @param index
     */
    generateKeyPair(wallet: any, index: number): Object {
      const addrNode = bip44hdkey.fromExtendedKey(wallet.externalNode.privateExtendedKey).deriveChild(index)
      let keypair =
      {
        publicKey: addrNode.getWallet().getPublicKeyString(),
        address: addrNode.getWallet().getChecksumAddressString(),
        derivationPath: `m/44'/60'/0'/0/${index}`,
        privateKey: addrNode.getWallet().getPrivateKeyString(),
        type: 'Ethereum'
      };
      return keypair
    }

    /**
     *
     * @param wif
     */
    importWIF(wif: string): Object {
      const rawKey = Buffer.from(wif, 'hex')
      const keypair = this.ethereumlib.fromPrivateKey(rawKey)
      const result =
      {
        publicKey: '0x' + keypair.getPublicKeyString(),
        address: keypair.getChecksumAddressString(),
        privateKey: '0x' + keypair.getPrivateKey().toString('hex'),
        type: 'Ethereum'
      }
      return result
    }

    /**
     *
     * @param keys
     */
    gernerateP2SHMultiSig(keys: string[]): Object {
      throw new Error('Method not use for Ethereum')
    }

    /**
     *
     * @param options
     */
    createRawTx(options: any): Object {
      const privateKey = new Buffer('42193c2610f6f7ff06becfef595b4810d8808bdfee1dba819f69686353093f73', 'hex')
      const tx: any = new EthereumTx(options)
      tx.sign(privateKey)

      const feeCost = tx.getUpfrontCost()
      tx.gas = feeCost
      return tx
    }

    broadcastTx(rawTx: object): String {
      throw new Error('Method not yet implemented')
    }

    /**
     *
     * @param tx
     */
    verifyTxSignature(tx: any): boolean {
      if (tx.verifySignature()) {
        return true
      } else {
        return false
      }
    }
    /**
     *
     */
    create1t1tx(): String {
      throw new Error('Method not used for ethereum.')
    }

    /**
     *
     */
    create2t2tx(txparams: any): String {
      throw new Error('Method not used for ethereum.')
    }
  }
}

export default CryptoWallet.SDKS.Ethereum.EthereumSDK
