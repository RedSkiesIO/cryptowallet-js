// /<reference path="../../types/module.d.ts" />
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
      return super.generateHDWallet(entropy, 'ETHEREUM')
    }

    /**
     *
     * @param wallet
     * @param index
     */
    generateKeyPair(wallet: any, index: number): Object {
      const addrNode = bip44hdkey.fromExtendedKey(wallet.externalNode.privateExtendedKey).deriveChild(index)
      const keypair =
      {
        publicKey: addrNode.getWallet().getPublicKeyString(),
        address: addrNode.getWallet().getChecksumAddressString(),
        derivationPath: `m/44'/60'/0'/0/${index}`,
        privateKey: addrNode.getWallet().getPrivateKeyString(),
        type: 'Ethereum',
        network: wallet.network
      }
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
      throw new Error('Method not used for Ethereum')
    }

    /**
     *
     * @param options
     */
    createRawTx(keypair: any, toAddress: String, amount: number): Object {
      const privateKey = new Buffer(keypair.privateKey, 'hex')
      const txParams = {
        nonce: '0x00',
        gasPrice: '100',
        gasLimit: '1000',
        to: toAddress,
        value: amount,
        chainId: 3
      }
      const tx: any = new EthereumTx(txParams)
      tx.sign(privateKey)

      const feeCost = tx.getUpfrontCost()
      tx.gas = feeCost
      return tx
    }

    broadcastTx(rawTx: object, network: string): Object {
      const tx = {
        tx: rawTx
      }
      return new Promise((resolve, reject) => {
        this.request.post({ url: this.networks[network].sendTxApi, form: JSON.stringify(tx) }, function (error: any, body: any, result: any) {
          if (error) {
            return reject("Transaction failed: " + error)
          }
          const output = JSON.parse(result)
          result = output.tx.hash
          return resolve(result)
        })
      })

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
