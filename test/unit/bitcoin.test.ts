import * as Mocha from 'mocha'
import * as Chai from 'chai'
import * as Bitcoin from 'bitcoinjs-lib'
import { CryptoWallet } from '../../src/SDKFactory'
// import CryptoWallet from '../../src/CryptoWallet';

const request = require('request')
var assert = Chai.assert
// const regtestUtils = require('../_regtest')
// const regtest = regtestUtils.network
const expect = Chai.expect
const btc = CryptoWallet.createSDK('Bitcoin')

const entropy = 'nut mixture license bean page mimic iron spice rail uncover then warfare'
const network = 'BITCOIN'
const rootKey: string = 'xprv9s21ZrQH143K468LbsXz8YqCZjiP1ZCLXy4nV352PWToQYEi1WxeEDKzWRd3vWbSfUjQuFAPwPMPG1KRVtsLDc3YvD7X1MktbTzcmsEqjPw'

const bip = 49
const derPath = `m/49'/0'/0'/0/0`


describe('bitcoinSDK (wallet)', () => {
  it('can generate a BTC HD wallet', () => {
    const wallet: any = btc.generateHDWallet(entropy, network)

    expect(wallet.mnemonic).to.equal(entropy)
    expect(wallet.privateKey).to.equal(rootKey)
    expect(wallet.bip).to.equal(bip)
    expect(wallet.type).to.equal(0)
  })

  it('can create a key pair', () => {
    const wallet: any = btc.generateHDWallet(entropy, network)
    const keypair: any = btc.generateKeyPair(wallet, 0)
    assert.strictEqual(keypair.derivationPath, derPath)
    assert.strictEqual(keypair.address, '3E93qR2WQ6o3amf4JQuUHzg11c87HKwJAx')
    assert.strictEqual(keypair.publicKey, '0338306f579ff3bbbabcd2183bdd325757eb8610399f5178e8609daec510d0117e')
    assert.strictEqual(keypair.privateKey, 'L3HzwnRNYi193kEQRJpNprvEwFB5BE7LfRMPw9xNJ3sPXNhDUe73')
    assert.equal(keypair.type, 'Bitcoin')
  })

  it('can import a keypair from a WIF', () => {
    const address = btc.importWIF('L3HzwnRNYi193kEQRJpNprvEwFB5BE7LfRMPw9xNJ3sPXNhDUe73')
    assert.strictEqual(address, '3E93qR2WQ6o3amf4JQuUHzg11c87HKwJAx')
  })

  // it('can generate a segwit address', () => {
  //   const wallet: any = btc.generateHDWallet(entropy, network)
  //   const keypair: any = btc.generateKeyPair(wallet, 0)
  //   const segwitAddress: any = btc.generateSegWitAddress(keypair)

  // })


  it('can create a raw transaction', async () => {
    // Test address: 2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf
    const wallet: any = btc.generateHDWallet(entropy, 'BITCOIN_TESTNET')
    const fromAccount: any = btc.generateKeyPair(wallet, 0)
    const toAccount: any = btc.generateKeyPair(wallet, 1)
    const amount: number = 0.001


    const rawTx = await btc.createRawTx(fromAccount, toAccount.address, amount)


    const sendTx = await btc.broadcastTx(rawTx, 'BITCOIN_TESTNET');
    console.log(sendTx);

  })

  // it('server test', () => {
  //   const ElectrumCli = require('electrum-client')
  //   const main = async () => {
  //     const ecl = new ElectrumCli(8000, '192.168.1.216', 'tcp') // tcp or tls
  //     await ecl.connect() // connect(promise)
  //     ecl.subscribe.on('blockchain.headers.subscribe', (v) => console.log(v)) // subscribe message(EventEmitter)
  //     try {
  //       const ver = await ecl.server_version("test", "1.8.12") // json-rpc(promise)
  //       console.log('success ' + ver)
  //     } catch (e) {
  //       console.log(e)
  //     }
  //     await ecl.close() // disconnect(promise)
  //   }
  //   main()

  // })
})


