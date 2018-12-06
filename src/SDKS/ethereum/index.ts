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
    getUTXOs(addresses: String[], network: string): Object {
      throw new Error("Method not implemented.");
    }
    createRawTx(accounts: object[], change: string, utxos: any, network: string, toAddress: string, amount: number): Object {
      throw new Error("Method not implemented.");
    }




    private ethereumlib = EthereumLib;
    private web3: any = Web3;



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
     * @param keypair 
     * @param toAddress 
     * @param amount 
     */
    // createRawTx(keypair: any, toAddress: String, amount: number): Object {
    //   const privateKey = new Buffer(keypair.privateKey.substr(2), 'hex')
    //   const web3 = new Web3(new Web3.providers.httpProvider('https://ropsten.infura.io/v61hsMvKfFW08T9q4Msu'))


    //   return new Promise((resolve, reject) => {
    //     web3.eth.getTransactionCount(keypair, function (err: any, nonce: any) {
    //       if (err) {
    //         return reject(err)
    //       }

    //       const tx = new EthereumTx({
    //         nonce: nonce,
    //         gasPrice: web3.toHex(web3.toWei('20', 'gwei')),
    //         gasLimit: web3.toHex(100000),
    //         to: toAddress,
    //         value: web3.toHex(web3.toWei(amount)),
    //         chainId: 3
    //       })
    //       tx.sign(privateKey)
    //       const raw = '0x' + tx.serialize().toString('hex')
    //       return resolve(raw)
    //     })
    //   })
    // }

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

    getTransactionHistory(address: string, addresses: string[], network: string, lastBlock: number, beforeBlock?: number, limit?: number): Object {
      return new Promise(async (resolve, reject) => {


        const URL = 'http://api-ropsten.etherscan.io/api?module=account&action=txlist&address=' + address + '&startblock=' + lastBlock + '&sort=desc&apikey=' + this.networks.ethToken

        await this.axios.get(URL)
          .then(async (res: any) => {

            if (!res.data.result) {
              return resolve()
            }
            else {
              let transactions: any = []

              const nextBlock: number = 0//res.data.result[0].blockNumber
              res.data.result.forEach((r: any) => {
                let receiver = r.to, sent = false, confirmed = false, contractCall = false
                if (r.from === address.toLowerCase()) {
                  sent = true
                }
                if (r.confirmations > 11) {
                  confirmed = true

                }
                if (!r.to) {
                  receiver = r.contractAddress
                  contractCall = true
                }

                const transaction = {
                  hash: r.hash,
                  blockHeight: r.blockNumber,
                  fee: r.cumulativeGasUsed,
                  sent: sent,
                  value: r.value,
                  sender: r.from,
                  receiver: receiver,
                  contractCall: contractCall,
                  confirmed: confirmed,
                  confirmedTime: r.timeStamp
                }

                transactions.push(transaction)
              })
              let balance = 0
              await this.axios.get('https://api-ropsten.etherscan.io/api?module=account&action=balance&address=' + address + '&tag=latest&apikey=' + this.networks.ethToken)
                .then((res: any) => {
                  balance = res.data.result

                  const history = {
                    address: address,
                    balance: balance,
                    totalTransactions: transactions.length,
                    nextBlock: nextBlock,
                    txs: transactions

                  }

                  return resolve(history)

                })
            }

          })
      })




    }


    getWalletHistory(addresses: string[], network: string, lastBlock: number, full?: boolean): Object {
      const result: any = []

      return new Promise((resolve, reject) => {
        const promises: any = [];

        addresses.forEach((address: any) => {

          promises.push(

            new Promise(async (resolve, reject) => {
              const history: any = await this.getTransactionHistory(address, addresses, network, 0, lastBlock)
              if (history.totalTransactions > 0) {
                result.push(history)
              }
              resolve()
            })
          )

        })

        Promise.all(promises).then(() => {
          resolve(result)
        })
      })
    }

    accountDiscovery(entropy: string, network: string, internal?: boolean): Object {
      const wallet = this.generateHDWallet(entropy, network)

      const accounts = []

      for (let i: number = 0; i < 10; i++) {
        const key: any = this.generateKeyPair(wallet, i)
        const account = {
          address: key.address,
          index: i
        }
        accounts.push(account)
      }

      return accounts
      // var api = require('etherscan-api').init(this.networks.ethToken, 'ropsten', '3000');

      // let usedAddresses: any = []
      // let emptyAddresses: any = []
      // let transactions: any = []
      // let balance: number = 0
      // let txs: any = []



      // function checkAddress(address: string, i: number): Promise<object> {

      //   return new Promise(async (resolve, reject) => {
      //     let addrBalance = 0;
      //     let result: object;

      //     const txlist = api.account.txlist(address)
      //     txlist.then(function (data: any) {
      //       console.log('api called')
      //       console.log(data)
      //       console.log(data.status)
      //       if (data) {

      //         const getBalance = api.account.balance(address)
      //         getBalance.then(function (value: any) {
      //           addrBalance = value.result
      //           balance += value.result

      //           result = {
      //             address: address,
      //             balance: addrBalance,
      //             index: i
      //           }
      //           console.log(result)
      //           usedAddresses.push(result)

      //           data.result.forEach((tx: any) => {
      //             let sent = false
      //             let receiver = tx.to
      //             let contractCall = false
      //             let confirmed = false
      //             if (tx.from === address) {
      //               sent = true

      //             }
      //             if (!tx.to) {
      //               receiver = tx.contractAddress
      //               contractCall = true
      //             }
      //             if (tx.confirmations > 11) {
      //               confirmed = true
      //             }

      //             const transaction = {
      //               hash: tx.hash,
      //               blockHeight: tx.blockNumber,
      //               fee: tx.cumulativeGasUsed,
      //               sent: sent,
      //               value: tx.value,
      //               senders: tx.from,
      //               receiver: receiver,
      //               contractCall: contractCall,
      //               confirmed: confirmed,
      //               confirmedTime: tx.timeStamp
      //             }
      //             transactions.push(transaction)

      //           })
      //         });
      //       }
      //       else {
      //         emptyAddresses.push(i)
      //       }

      //       return resolve({ address })


      //     });

      //   });

      // }
      // console.log('promise entered')
      // return new Promise(async (resolve, reject) => {

      //   let discover = true
      //   let startIndex = 0

      //   while (discover) {
      //     let promises = []

      //     for (let i: any = startIndex; i < startIndex + 20; i++) {
      //       const keypair: any = this.generateKeyPair(wallet, i)

      //       promises.push(new Promise(async (resolve, reject) => {

      //         return resolve(checkAddress(keypair.address, i))
      //       })
      //       )
      //     }
      //     console.log('all promises started')
      //     await Promise.all(promises)
      //     if (emptyAddresses.length > 0) {
      //       const min = Math.min(...emptyAddresses)
      //       startIndex = min
      //     }
      //     if (emptyAddresses.length > 20) {
      //       discover = false
      //     }
      //   }


      //   const result = {
      //     balance: balance,
      //     used: usedAddresses,
      //     nextAddress: startIndex,
      //     txs: txs
      //   }
      //   console.log(emptyAddresses)
      //   return resolve(result)
      // })
      //   .catch(function (reason) {
      //     console.log('ERROR: ' + reason)

      //   })

    }

  }
}

export default CryptoWallet.SDKS.Ethereum.EthereumSDK
