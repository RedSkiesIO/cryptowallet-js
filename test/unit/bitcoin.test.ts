import * as Mocha from 'mocha';
import * as Chai from 'chai';
import * as Bitcoin from 'bitcoinjs-lib';
import { CryptoWallet } from '../../src/SDKFactory';
import * as Bitcore from 'bitcore-lib';

const request = require('request')
var assert = Chai.assert;
//const regtestUtils = require('../_regtest')
//const regtest = regtestUtils.network
const expect = Chai.expect;
const btc = CryptoWallet.createSDK('Bitcoin');
const entropy = 'nut mixture license bean page mimic iron spice rail uncover then warfare'
const network = 'BITCOIN'
const rootKey: string = 'xprv9s21ZrQH143K468LbsXz8YqCZjiP1ZCLXy4nV352PWToQYEi1WxeEDKzWRd3vWbSfUjQuFAPwPMPG1KRVtsLDc3YvD7X1MktbTzcmsEqjPw'

const bip = 49;
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

  it('can generate a segwit address', () => {
    const wallet: any = btc.generateHDWallet(entropy, network)
    const keypair: any = btc.generateKeyPair(wallet, 0)
    //const segwitAddress: any = btc.generateSegWitAddress(keypair)


  })
  // it('can create a raw transaction', () => {
  //   const wallet: any = btc.generateHDWallet(entropy, 'BITCOIN_TESTNET')
  //   const keypair1: any = btc.generateKeyPair(wallet, 0)
  //   const keypair2: any = btc.generateKeyPair(wallet, 0)
  //   const testnet = Bitcoin.networks.testnet
  //   const keyPair = Bitcoin.ECPair.fromWIF(keypair1.privateKey, testnet)


  //   let addr = keypair1.address
  //   let apiUrl = 'https://testnet.blockexplorer.com/api/addr/'

  //   let utxo: any, balance: any, options: object;
  //   // log unspent transactions
  //   request.get(apiUrl + addr + '/utxo', (err: any, req: any, body: any) => {
  //     utxo = JSON.parse(body)
  //     const amountToKeep = utxo[0].satoshis - 100000
  //     options = {
  //       keyPair: keyPair,
  //       vout: 1,
  //       txid: utxo[0].txid,
  //       sendTo: keypair2.address,
  //       amountToSend: 100000,
  //       changeAddress: keypair1.address,
  //       change: amountToKeep
  //     }
  //     const rawTx = btc.createRawTx(options)
  //     console.log(rawTx)
  //   }
  //   );


  // })

  it('can create a raw transaction', () => {
    //Test address: 2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf
    const wallet: any = btc.generateHDWallet(entropy, 'BITCOIN_TESTNET');
    const fromAccount: any = btc.generateKeyPair(wallet, 0);
    const toAccount: any = btc.generateKeyPair(wallet, 1);
    const amount: number = 0.001;


    const rawTx = btc.createRawTx(fromAccount, toAccount.address, amount);
    console.log(rawTx);


  })

});


