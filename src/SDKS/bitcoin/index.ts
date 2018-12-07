///<reference path="../../types/module.d.ts" />
import GenericSDK from '../GenericSDK'
import * as IBitcoinSDK from './IBitcoinSDK'
import * as BitcoinLib from 'bitcoinjs-lib'
import * as Bitcoinaddress from 'bitcoin-address'
import * as Coinselect from 'coinselect'
import * as Request from 'request'
import * as Networks from '../networks'
import * as Explorers from 'bitcore-explorers'




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
        redeem: this.bitcoinlib.payments.p2wpkh({ pubkey: addrNode.publicKey, network: wallet.network.connect }),
        network: wallet.network.connect
      })

      const keypair =
      {
        publicKey: addrNode.publicKey.toString('hex'),
        address: address,
        privateKey: this.wif.encode(wallet.network.connect.wif, addrNode.privateKey, true),
        derivationPath: `m/49'/${wallet.type}'/0'/0/${index}`,
        type: wallet.network.name,
        network: wallet.network,
        change: internal
      }

      return keypair
    }


    /**
     *
     * @param keyPair
     */
    generateSegWitAddress(keyPair: any): Object {
      return this.bitcoinlib.payments.p2wpkh({ pubkey: keyPair.publicKey, network: keyPair.network })
    }

    /**
     *
     * @param keyPair
     */
    generateSegWitP2SH(keyPair: any): Object {
      return this.bitcoinlib.payments.p2sh({
        redeem: this.bitcoinlib.payments.p2wpkh({ pubkey: keyPair.publicKey, network: keyPair.network })
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
      return address
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

    getUTXOs(addresses: Array<String>, network: string): Object {

      return new Promise((resolve, reject) => {
        const unit = Explorers.Unit
        const insight = new Explorers.Insight('https://test-insight.bitpay.com', 'testnet');
        insight.getUnspentUtxos(addresses, function (error: string, utxos: any) {
          if (error) {
            //any other error
            console.log(error);
            return reject('1:' + error);
          }
          else {
            const result: any = []

            utxos.forEach((utxo: any) => {
              const u = utxo.toJSON()
              u.value = utxo.satoshis
              result.push(u)
            })


            if (utxos.length == 0) {
              //if no transactions have happened, there is no balance on the address.
              return reject("You have no funds");
            }

            return resolve(result)
          }

        })
      })
    }

    /**
     *
     * @param keypair
     * @param toAddress
     * @param amount
     */
    createRawTx(accounts: object[], change: string, utxos: any, wallet: any, toAddress: string, amount: number): Object {
      const unit = Explorers.Unit
      const feeRate = 128
      const transactionAmount = amount * 100000000
      const minerFee = 0.0001 * 100000000
      const net = wallet.network
      let rawTx


      return new Promise((resolve, reject) => {

        if (utxos.length === 0) {
          // if no transactions have happened, there is no balance on the address.
          return reject("1: You don't have enough Satoshis to cover the miner fee.")
        }

        // get balance
        let balance = 0


        for (var i = 0; i < utxos.length; i++) {
          balance += utxos[i]['value']
        }


        // check whether the balance of the address covers the miner fee
        if ((balance - transactionAmount - minerFee) > 0) {


          let targets = [{
            address: toAddress,
            value: transactionAmount
          }]


          let { inputs, outputs, fee } = Coinselect(utxos, targets, feeRate)
          let accountsUsed: any = []
          let p2shUsed: any = []
          inputs.forEach((input: any) => {

            accounts.forEach((account: any) => {
              let key: any
              if (input.address === account.address) {


                if (account.change) {
                  key = this.generateKeyPair(wallet, account.index, true)
                }
                else {
                  key = this.generateKeyPair(wallet, account.index)
                }

                const keyPair = this.bitcoinlib.ECPair.fromWIF(key.privateKey, net.connect)
                const p2wpkh = this.bitcoinlib.payments.p2wpkh({ pubkey: keyPair.publicKey, network: net.connect })
                const p2sh = this.bitcoinlib.payments.p2sh({ redeem: p2wpkh, network: net.connect })
                accountsUsed.push(keyPair)
                p2shUsed.push(p2sh)
              }
            })
          })

          const txb = new BitcoinLib.TransactionBuilder(net.connect)


          txb.setVersion(1)

          inputs.forEach((input: any) => {
            txb.addInput(input.txid, input.vout)
          })

          outputs.forEach((output: any) => {
            if (!output.address) {
              output.address = change
            }
            txb.addOutput(output.address, output.value)
          })

          inputs.forEach((input: any) => {
            let i = 0
            txb.sign(i, accountsUsed[i], p2shUsed[i].redeem.output, undefined, inputs[i].value)
            i++
          })
          rawTx = txb.build().toHex()
          console.log(rawTx)
          return resolve(rawTx)
        } else {
          return reject("2: You don't have enough Satoshis to cover the miner fee.")
        }

      })
    }

    broadcastTx(rawTx: object, network: string): Object {
      const tx = {
        tx: rawTx
      }
      return new Promise((resolve, reject) => {
        Request.post({ url: this.networks[network].sendTxApi, form: JSON.stringify(tx) }, function (error: any, body: any, result: any) {
          if (error) {
            return reject('Transaction failed: ' + error)
          }
          const output = JSON.parse(result)
          result = output.tx.hash
          return resolve(result)
        })
      })
    }

    // createRawTx(keypair: any, toAddress: string, amount: number): Object {

    //   return new Promise((resolve, reject) => {
    //     const fromAddress = keypair.address;
    //     console.log(fromAddress)
    //     const unit = Bitcore.Unit;
    //     const insight = new Explorers.Insight('https://test-insight.bitpay.com', 'testnet');
    //     const minerFee = unit.fromMilis(0.128).toSatoshis(); //cost of transaction in satoshis (minerfee)
    //     const transactionAmount = unit.fromMilis(amount).toSatoshis(); //convert mBTC to Satoshis using bitcore unit

    //     // if (!Bitcoinaddress.validate(fromAddress)) {
    //     //   return reject('Origin address checksum failed');
    //     // }
    //     // if (!Bitcoinaddress.validate(toAddress)) {
    //     //   return reject('Recipient address checksum failed');
    //     // }


    //     insight.getUnspentUtxos(fromAddress, function (error: string, utxos: any) {
    //       if (error) {
    //         //any other error
    //         console.log(error);
    //         return reject('1:' + error);

    //       } else {

    //         console.log(utxos)
    //         if (utxos.length == 0) {
    //           //if no transactions have happened, there is no balance on the address.
    //           return reject("You don't have enough Satoshis to cover the miner fee.");
    //         }

    //         //get balance
    //         let balance = unit.fromSatoshis(0).toSatoshis();
    //         for (var i = 0; i < utxos.length; i++) {
    //           balance += unit.fromSatoshis(parseInt(utxos[i]['satoshis'])).toSatoshis();
    //         }

    //         //check whether the balance of the address covers the miner fee
    //         if ((balance - transactionAmount - minerFee) > 0) {


    //           //create a new transaction
    //           try {
    //             let bitcore_transaction: any = new Bitcore.Transaction()
    //               .from(utxos)
    //               .to(toAddress, transactionAmount)
    //               .fee(minerFee)
    //               .change(fromAddress)
    //               .sign(keypair.privateKey);

    //             return bitcore_transaction.serialize()
    //             //handle serialization errors
    //             // if (bitcore_transaction.getSerializationError()) {
    //             //   let error = bitcore_transaction.getSerializationError().message;
    //             //   switch (error) {
    //             //     case 'Some inputs have not been fully signed':
    //             //       return reject('Please check your private key');
    //             //       break;
    //             //     default:

    //             //     //return reject('2:' + error);
    //             //   }
    //             // }

    //             // broadcast the transaction to the blockchain
    //             // insight.broadcast(bitcore_transaction, function (error: string, body: any) {
    //             //   if (error) {
    //             //     reject('Error in broadcast: ' + error);
    //             //   } else {
    //             //     resolve({
    //             //       transactionId: body
    //             //     });
    //             //   }
    //             // });
    //             resolve({
    //               bitcore_transaction
    //             })

    //           } catch (error) {
    //             return reject('3:' + error);
    //           }
    //         } else {
    //           return reject("You don't have enough Satoshis to cover the miner fee.");
    //         }
    //       }
    //     });
    //   });

    // }

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

    accountDiscovery(entropy: string, network: string, internal?: boolean): Object {
      const wallet = this.generateHDWallet(entropy, network)

      const insight: any = new Explorers.Insight('https://test-insight.bitpay.com', 'testnet')
      let usedAddresses: any = []
      let emptyAddresses: any = []
      let change = false
      if (internal) {
        change = true
      }


      function checkAddress(address: string, i: number): Promise<object> {

        return new Promise(async (resolve, reject) => {
          await insight.address(address, function (err: any, address: any) {
            if (err) {
              console.log(err)
            } else {


              const result = {
                address: address.address.toString(),
                received: address.totalReceived,
                balance: address.balance,
                index: i
              }

              if (result.received > 0) {
                usedAddresses.push(result)
              }
              else {
                emptyAddresses.push(result.index)
              }
              return resolve(result)
            }
          });

        })
      }

      return new Promise(async (resolve, reject) => {
        let discover = true
        let startIndex = 0

        while (discover) {
          let promises = []

          for (let i: any = startIndex; i < startIndex + 20; i++) {
            const keypair: any = this.generateKeyPair(wallet, i, internal)

            promises.push(new Promise(async (resolve, reject) => {

              return resolve(checkAddress(keypair.address, i))
            })
            )
          }

          await Promise.all(promises)
          if (emptyAddresses.length > 0) {
            const min = Math.min(...emptyAddresses)
            startIndex = min
          }
          if (emptyAddresses.length > 20) {
            discover = false
          }
        }

        if (internal) {
          usedAddresses = usedAddresses.filter((item: any) => {
            if (item.balance === 0) return false;
            return true;
          });
        }

        const result = {
          used: usedAddresses,
          nextAddress: startIndex,
          change: change
        }


        return resolve(result)


      })

    }



  }
}
export default CryptoWallet.SDKS.Bitcoin.BitcoinSDK
