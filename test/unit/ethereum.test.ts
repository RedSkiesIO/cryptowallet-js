/* eslint-disable import/no-unresolved */
import * as Mocha from 'mocha';
import * as Chai from 'chai';
import { generateKeyPair } from 'crypto';
import { AssertionError } from 'assert';
import { CryptoWallet } from '../../src/SDKFactory';
import ERC20 from '../../src/SDKS/erc20';

const { assert } = Chai;

const { expect } = Chai;
const eth: any = CryptoWallet.createSDK('Ethereum');
const erc20 = new ERC20();
const entropy = 'nut mixture license bean page mimic iron spice rail uncover then warfare';
const network = 'ETHEREUM_ROPSTEN';
const rootKey: string = 'xprv9s21ZrQH143K468LbsXz8YqCZjiP1ZCLXy4nV352PWToQYEi1WxeEDKzWRd3vWbSfUjQuFAPwPMPG1KRVtsLDc3YvD7X1MktbTzcmsEqjPw';


const bip = 44;
const address1 = '0x1ceBf494c8d33948e4Ec8E9d026cb46cd152B3bc';
const privKey1 = '0xd701f769f4878f79369d5fa87cfa661b978d284121019d41d654b2ccbb40fc2c';
const pubKey1 = '0x02201bde53932f1eae0c3108c26ac2de2d7662faeb59fd8ef552ec9d40310187bc';
const derPath = 'm/44\'/60\'/0\'/0/0';

describe('ethereumSDK (wallet)', () => {
  // it('can create a HD wallet', () => {
  //   const wallet: any = eth.generateHDWallet(entropy, network)

  //   expect(wallet.mnemonic).to.equal(entropy)
  //   expect(wallet.privateKey).to.equal(rootKey)
  //   expect(wallet.bip).to.equal(bip)
  //   expect(wallet.type).to.equal(60)
  // })

  // it('can create a key pair', () => {
  //   const wallet: any = eth.generateHDWallet(entropy, network)
  //   const keypair: any = eth.generateKeyPair(wallet, 0)
  //   assert.strictEqual(keypair.derivationPath, derPath)
  //   assert.strictEqual(keypair.address, '0x8f97Bb9335747E4fCdDA8680F66ed96DcBe27F49')
  //   assert.strictEqual(
  // keypair.privateKey, '0x42193c2610f6f7ff06becfef595b4810d8808bdfee1dba819f69686353093f73')
  //   assert.strictEqual(keypair.type, 'Ethereum')
  // })

  // it('can import key from WIF', () => {
  //   const keypair: any = eth.importWIF(
  // '42193c2610f6f7ff06becfef595b4810d8808bdfee1dba819f69686353093f73')

  //   assert.strictEqual(keypair.address, '0x8f97Bb9335747E4fCdDA8680F66ed96DcBe27F49')
  //   assert.strictEqual(
  // keypair.privateKey, '0x42193c2610f6f7ff06becfef595b4810d8808bdfee1dba819f69686353093f73')
  // })

  it('can transfer an erc20 token', async () => {
    const contract = '0x26705403968a8c73656a2fed0f89245698718f3f';
    const wallet: any = eth.generateHDWallet(entropy, network);
    const keypair: any = eth.generateKeyPair(wallet, 0);
    const erc20Wallet: any = erc20.generateERC20Wallet(keypair, 'Atlas City Token', 'ACT', contract, 3);
    const balance = await erc20.getERC20Balance(erc20Wallet);
    // const sendTx = await erc20.transferAllowanceERC20(
    // erc20Wallet, '0x6B92382DEdd2bb7650eB388C553568552206b102', 10000)
    console.log(balance);
  });

  // it('can restore a wallet from the mnemonic', async () => {

  //   const accounts: any = await eth.accountDiscovery(entropy, 'ETHEREUM_ROPSTEN')
  //   console.log(accounts)

  // })

  // it('can get the transaction history of a wallet', async () => {
  //   const wallet = eth.generateHDWallet(entropy, 'ETHEREUM')
  //   const addresses = []

  //   for (let i: number = 0; i < 10; i++) {
  //     const key: any = eth.generateKeyPair(wallet, i)
  //     addresses.push(key.address)
  //   }

  //   const history = await eth.getWalletHistory(addresses, 'ETHEREUM_ROPSTEN', 0)
  //   console.log(history)
  //   //const tData: any = await eth.getWalletHistory(addresses, 'ETHEREUM', 0, true)

  // })

  // it('can createTX', async () => {
  //   const wallet: any = eth.generateHDWallet(entropy, network)
  //   const keypair: any = eth.generateKeyPair(wallet, 0)
  //   const keypair2: any = eth.generateKeyPair(wallet, 1)

  //   const rawTx = await eth.createEthTx(keypair, keypair2.address, 0.01)
  //   console.log(rawTx)
  //   const sendTx = await eth.broadcastTx(rawTx, 'ETHEREUM_ROPSTEN')
  //   console.log(sendTx)
  //   // const verify = eth.verifyTxSignature(rawTx)
  //   // assert.strictEqual(verify, true)
  // })

  it('can get the transaction history of an ERC20 wallet', async () => {
    const wallet = eth.generateHDWallet(entropy, 'ETHEREUM_ROPSTEN');
    const contract = '0x26705403968a8c73656a2fed0f89245698718f3f';
    const keypair: any = eth.generateKeyPair(wallet, 0);
    const erc20Wallet: any = erc20.generateERC20Wallet(keypair, 'Atlas City Token', 'ACT', contract, 3);

    const history = await erc20.getERC20TransactionHistory(erc20Wallet);
    console.log(history);
  });
});


