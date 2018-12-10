import * as Mocha from 'mocha'
import * as Chai from 'chai'
import * as Bitcoin from 'bitcoinjs-lib'
import { CryptoWallet } from '../../src/SDKFactory'

const request = require('request')
var assert = Chai.assert
const expect = Chai.expect
const btc = CryptoWallet.createSDK('Bitcoin')

const entropy = 'nut mixture license bean page mimic iron spice rail uncover then warfare'
const entropy2 = 'calm steel soccer pulse polar depend bar bargain give pave ancient member'
const network = 'BITCOIN_TESTNET'
const rootKey: string = 'xprv9s21ZrQH143K468LbsXz8YqCZjiP1ZCLXy4nV352PWToQYEi1WxeEDKzWRd3vWbSfUjQuFAPwPMPG1KRVtsLDc3YvD7X1MktbTzcmsEqjPw'

const bip = 49
const derPath = `m/49'/0'/0'/0/0`


describe('bitcoinSDK (wallet)', () => {
  // it('can generate a BTC HD wallet', () => {
  //   const wallet: any = btc.generateHDWallet(entropy, network)

  //   expect(wallet.mnemonic).to.equal(entropy)
  //   expect(wallet.privateKey).to.equal(rootKey)
  //   expect(wallet.bip).to.equal(bip)
  //   expect(wallet.type).to.equal(0)
  // })

  // it('can create a key pair', () => {
  //   const wallet: any = btc.generateHDWallet(entropy, network)
  //   const keypair: any = btc.generateKeyPair(wallet, 0)
  //   assert.strictEqual(keypair.derivationPath, derPath)
  //   assert.strictEqual(keypair.address, '3E93qR2WQ6o3amf4JQuUHzg11c87HKwJAx')
  //   assert.strictEqual(keypair.publicKey, '0338306f579ff3bbbabcd2183bdd325757eb8610399f5178e8609daec510d0117e')
  //   assert.strictEqual(keypair.privateKey, 'L3HzwnRNYi193kEQRJpNprvEwFB5BE7LfRMPw9xNJ3sPXNhDUe73')
  //   assert.equal(keypair.type, 'Bitcoin')
  // })

  // it('can import a keypair from a WIF', () => {
  //   const address = btc.importWIF('L3HzwnRNYi193kEQRJpNprvEwFB5BE7LfRMPw9xNJ3sPXNhDUe73')
  //   assert.strictEqual(address, '3E93qR2WQ6o3amf4JQuUHzg11c87HKwJAx')
  // })

  // it('can generate a segwit address', () => {
  //   const wallet: any = btc.generateHDWallet(entropy, network)
  //   const keypair: any = btc.generateKeyPair(wallet, 0)
  //   const segwitAddress: any = btc.generateSegWitAddress(keypair)

  // })


  // it('can create a raw transaction and broadcast it', async () => {
  //   // Test address: 2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf
  //   const wallet: any = btc.generateHDWallet(entropy, 'BITCOIN_TESTNET')
  //   const fromAccount: any = btc.generateKeyPair(wallet, 0)
  //   const toAccount: any = btc.generateKeyPair(wallet, 1)
  //   const amount: number = 0.001


  //   const rawTx = await btc.createRawTx(fromAccount, toAccount.address, amount)


  //   const sendTx = await btc.broadcastTx(rawTx, 'BITCOIN_TESTNET');
  //   console.log(sendTx);

  // })

  // it('can get the transaction history of a wallet', async () => {
  //   const addresses = ['2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf', '2N6JMWTb79SMh94j82jfMKDSL3wXWkb1MFM']
  //   const tData: any = await btc.getWalletHistory(addresses, 'BITCOIN_TESTNET', 1446877, true)
  //   console.log(tData)

  // })


  // it('can get the unspent transactions of a wallet', async () => {
  //   const addresses = ['2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf', '2N6JMWTb79SMh94j82jfMKDSL3wXWkb1MFM']
  //   const tData: any = await btc.getUTXOs(addresses, 'BITCOIN_TESTNET')

  // })

  it('can create a raw transaction', async () => {
    const wallet = btc.generateHDWallet(entropy, 'BITCOIN_TESTNET')
    const receiverWallet = btc.generateHDWallet(entropy2, 'BITCOIN_TESTNET')

    const addresses = ['2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf', '2N6JMWTb79SMh94j82jfMKDSL3wXWkb1MFM']
    const utxos: any = await btc.getUTXOs(addresses, 'BITCOIN_TESTNET')
    console.log(utxos)

    const accounts = [{
      address: '2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf',
      index: 0,
      change: false
    },
    {
      address: '2N6JMWTb79SMh94j82jfMKDSL3wXWkb1MFM',
      index: 1,
      change: false

    }]

    const change: any = btc.generateKeyPair(wallet, 0, true)
    console.log('Change: ' + change.address)
    const testAddress: any = btc.generateKeyPair(receiverWallet, 0)
    console.log('To: ' + testAddress.address)

    const tData: any = await btc.createRawTx(accounts, change.address, utxos, wallet, testAddress.address, 0.001)
    console.log(tData)
  })




  // it('can discover an account', async (done) => {

  //   const externalAccountDiscovery: any = await btc.accountDiscovery(entropy, 'BITCOIN_TESTNET')
  //   const internalAccountDiscovery: any = await btc.accountDiscovery(entropy, 'BITCOIN_TESTNET', true)
  //   console.log(externalAccountDiscovery)
  //   console.log(internalAccountDiscovery)

  //   expect(1).to.equal(1)
  //   done()

  // })

})


