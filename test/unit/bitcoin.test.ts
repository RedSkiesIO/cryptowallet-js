import * as Mocha from 'mocha';
import * as Chai from 'chai'
import { CryptoWallet } from '../../src/SDKFactory';
import { generateKeyPair } from 'crypto';
import { AssertionError } from 'assert';

var assert = Chai.assert;

const expect = Chai.expect;
const btc = CryptoWallet.createSDK('Bitcoin');
const entropy = 'nut mixture license bean page mimic iron spice rail uncover then warfare'
const network = 'BITCOIN'
const rootKey: string = 'xprv9s21ZrQH143K468LbsXz8YqCZjiP1ZCLXy4nV352PWToQYEi1WxeEDKzWRd3vWbSfUjQuFAPwPMPG1KRVtsLDc3YvD7X1MktbTzcmsEqjPw'



const bip = 49;
const address1 = '0x1ceBf494c8d33948e4Ec8E9d026cb46cd152B3bc'
const privKey1 = '0xd701f769f4878f79369d5fa87cfa661b978d284121019d41d654b2ccbb40fc2c'
const pubKey1 = '0x02201bde53932f1eae0c3108c26ac2de2d7662faeb59fd8ef552ec9d40310187bc'
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

});


