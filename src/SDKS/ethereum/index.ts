// /<reference path="../../types/module.d.ts" />
import GenericSDK from '../GenericSDK'
import * as IWIF from '../IWIF'
import * as IEthereumSDK from './IEthereumSDK'
import * as bip44hdkey from 'ethereumjs-wallet/hdkey'
import * as EthereumLib from 'ethereumjs-wallet'
import * as EthereumTx from 'ethereumjs-tx'
import * as Web3 from 'web3'

export namespace CryptoWallet.SDKS.Ethereum {
  export class EthereumSDK extends GenericSDK implements IEthereumSDK.CryptyoWallet.SDKS.Ethereum.IEthereumSDK {
    accountDiscovery(entropy: string, netork: string): Object {
      throw new Error("Method not implemented.");
    }
    private ethereumlib = EthereumLib;
    private web3: any = Web3;
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
     * @param keypair 
     * @param toAddress 
     * @param amount 
     */
    createRawTx(keypair: any, toAddress: String, amount: number): Object {
      const privateKey = new Buffer(keypair.privateKey.substr(2), 'hex')
      const web3 = new Web3(new Web3.providers.httpProvider('https://ropsten.infura.io/v61hsMvKfFW08T9q4Msu'))

      return new Promise((resolve, reject) => {
        web3.eth.getTransactionCount(keypair, function (err: any, nonce: any) {
          if (err) {
            return reject(err)
          }

          const tx = new EthereumTx({
            nonce: nonce,
            gasPrice: web3.toHex(web3.toWei('20', 'gwei')),
            gasLimit: web3.toHex(100000),
            to: toAddress,
            value: web3.toHex(web3.toWei(amount)),
            chainId: 3
          })
          tx.sign(privateKey)
          const raw = '0x' + tx.serialize().toString('hex')
          return resolve(raw)
        })
      })
    }

    /**
     * 
     * @param rawTx 
     * @param network 
     */
    broadcastTx(rawTx: object, network: string): Object {
      const tx = {
        tx: rawTx
      }
      return new Promise((resolve, reject) => {
        this.request.post({ url: this.networks[network].sendTxApi, form: JSON.stringify(tx) }, function (error: any, body: any, result: any) {
          if (error) {
            return reject('Transaction failed: ' + error)
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

    // getTransactionHistory(address: string, network: string, lastBlock: number, beforeBlock?: number, limit?: number): Object {

    //   var api = require('etherscan-api').init('YourApiKey','ropsten', '3000');
    //   var txlist = api.account.txlist('0x3FAcfa472e86E3EDaEaa837f6BA038ac01F7F539');
    //   txlist.then(function (res: any) {
    //     res.result.forEach((r:any)=>{
    //       let sent, confirmed = false
    //       if(r.from === address){
    //         sent = true
    //       }
    //       if(r.confirmations > 11){
    //         confirmed = true

    //       }

    //       const transaction = {
    //         hash: r.hash,
    //         blockHeight: r.blockNumber,
    //         fee: r.cumulativeGasUsed,
    //         sent: sent,
    //         value: r.value,
    //         sender: r.from,
    //         receiver: r.to,
    //         confirmed: confirmed,
    //         confirmedTime: r.timeStamp

    //       }
    //     })

    //   })


    // }
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


    getWalletHistory(addresses: Array<String>, network: string, lastBlock: number, full?: boolean): Object {
      throw new Error('Method not used for ethereum.')
    }

    // accountDiscovery(entropy: string, network: string, internal?: boolean): Object {
    //   const wallet = this.generateHDWallet(entropy)


    //   var api = require('etherscan-api').init('YourApiKey','ropsten', '3000');

    //   let usedAddresses: any = []
    //   let emptyAddresses: any = []



    //   function checkAddress(address: string, i: number): Promise<object> {

    //     return new Promise(async (resolve, reject) => {
    //       const txlist = api.account.txlist(address)
    //       txlist.then(function (address:any){

    //         if (err) {
    //           console.log(err)
    //         } else {


    //           const result = {
    //             address: address,
    //             received: address.totalReceived,
    //             balance: address.balance,
    //             index: i
    //           }

    //           if (result.received > 0) {

    //             usedAddresses.push(result)
    //           }
    //           else {
    //             emptyAddresses.push(result.index)
    //           }
    //           return resolve(result)
    //         }


    //       })

    //       });


    //   }
    //   return new Promise(async (resolve, reject) => {
    //     let discover = true
    //     let startIndex = 0

    //     while (discover) {
    //       let promises = []

    //       for (let i: any = startIndex; i < startIndex + 20; i++) {
    //         const keypair: any = this.generateKeyPair(wallet, i)

    //         promises.push(new Promise(async (resolve, reject) => {

    //           return resolve(checkAddress(keypair.address, i))
    //         })
    //         )
    //       }

    //       await Promise.all(promises)
    //       if (emptyAddresses.length > 0) {
    //         const min = Math.min(...emptyAddresses)
    //         startIndex = min
    //       }
    //       if (emptyAddresses.length > 20) {
    //         discover = false
    //       }
    //     }

    //     if (internal) {
    //       usedAddresses.forEach((address: any) => {
    //         if (address.balance === 0) {
    //           usedAddresses.pull(address)
    //         }
    //       })
    //     }

    //     const result = {
    //       used: usedAddresses,
    //       nextAddress: startIndex,
    //     }


    //     return resolve(result)


    //   })

    // }

  }
}

export default CryptoWallet.SDKS.Ethereum.EthereumSDK
