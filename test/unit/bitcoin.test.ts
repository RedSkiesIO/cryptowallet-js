/* eslint-disable import/no-unresolved */
import * as Mocha from 'mocha';
import * as Chai from 'chai';
import * as Bitcoin from 'bitcoinjs-lib';
import { CryptoWallet } from '../../src/SDKFactory';

const request = require('request');

const { assert } = Chai;
const { expect } = Chai;

const btc: any = CryptoWallet.createSDK('Bitcoin');

const entropy = 'nut mixture license bean page mimic iron spice rail uncover then warfare';
const entropy2 = 'calm steel soccer pulse polar depend bar bargain give pave ancient member';
const testEntropy = 'nest orient spare seek crawl maze must pause grape bird quarter shrimp';
const network = 'BITCOIN_TESTNET';
const rootKey: string = 'xprv9s21ZrQH143K468LbsXz8YqCZjiP1ZCLXy4nV352PWToQYEi1WxeEDKzWRd3vWbSfUjQuFAPwPMPG1KRVtsLDc3YvD7X1MktbTzcmsEqjPw';

const bip = 49;
const derPath = 'm/49\'/1\'/0\'/0/0';


describe('bitcoinSDK (wallet)', () => {
  it('can generate a BTC HD wallet', () => {
    const wallet: any = btc.generateHDWallet(entropy, network);

    expect(wallet.mnemonic).to.equal(entropy);
    expect(wallet.privateKey).to.equal(rootKey);
    expect(wallet.bip).to.equal(bip);
    expect(wallet.type).to.equal(1);
  });

  it('can create a key pair', () => {
    const wallet: any = btc.generateHDWallet(entropy, network);
    const keypair: any = btc.generateKeyPair(wallet, 0);
    assert.strictEqual(keypair.derivationPath, derPath);
    assert.strictEqual(keypair.address, '2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf');
    assert.strictEqual(
      keypair.publicKey, '03f3ce9fafbcf2da98817a706e5d41272455df20b8f832f6700c1bb2652ac44de0',
    );
    assert.strictEqual(
      keypair.privateKey, 'cNJiShRC1rQqQ8MZDtvGWqHJq2sDgErcnq897jq1YMnpCm8JRFXr',
    );
    assert.equal(keypair.type, 'Bitcoin Testnet');
  });


  it('can import a keypair from a WIF', () => {
    const address = btc.importWIF('cNJiShRC1rQqQ8MZDtvGWqHJq2sDgErcnq897jq1YMnpCm8JRFXr', network);
    assert.strictEqual(address, '2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf');
  });

  it('can generate a segwit address', () => {
    const wallet: any = btc.generateHDWallet(entropy, network);
    const keypair: any = btc.generateKeyPair(wallet, 0);
    const segwitAddress: any = btc.generateSegWitAddress(keypair);
    assert.strictEqual(segwitAddress, 'tb1qgmfs2qjff3726j9sy76hpa2mnlnsvv4nnd7zxt');
  });

  it('can create a litecoin key pair', () => {
    const wallet: any = btc.generateHDWallet(entropy, 'LITECOIN');
    const keypair: any = btc.generateKeyPair(wallet, 0);
    assert.equal(keypair.address, 'M8d9iWobmxVNo1hHcovnxsUptzn7GGA4SL');
  });

  it('can create a litecoin testnet key pair', () => {
    const wallet: any = btc.generateHDWallet(entropy, 'LITECOIN_TESTNET');
    const keypair: any = btc.generateKeyPair(wallet, 0);
    assert.equal(keypair.address, 'QSc9ybA8G55zU5eSGrw32hFBe3R88gkLWc');
  });

  it('can create a dogecoin key pair', () => {
    const wallet: any = btc.generateHDWallet(entropy, 'DOGECOIN');
    const keypair: any = btc.generateKeyPair(wallet, 0);
    assert.equal(keypair.address, 'DTaFz5tzRjvk38e5La2Egrahat1V67Dk5k');
  });

  it('can create a dash key pair', () => {
    const wallet: any = btc.generateHDWallet(entropy, 'DASH');
    const keypair: any = btc.generateKeyPair(wallet, 0);
    assert.equal(keypair.address, 'XwzcnQSMZRhZDcNZZmskLB2ztiJnsD26vG');
  });


  // it('can get the transaction history of a wallet', async () => {
  //   const wallet: any = btc.generateHDWallet(entropy2, network);
  //   const addresses: any = ['2NB9kPS83wUZHdFu222vJNXSJXBvVoVgvqc',
  //     '2NDbQDbR89XMTbTDSzfWUS93DXbywDqYCtH',
  //     '2MwVmHjSWw3XrHpAn38mAr69MbD2A4wXcvy'];
  //   const tData: any = await btc.getWalletHistory(
  //     addresses, 'BITCOIN_TESTNET', 0, true,
  //   );
  //   console.log(tData);
  // });

  it('can get the transaction history of a wallet', async () => {
    const wallet: any = btc.generateHDWallet(entropy2, network);
    const addresses: any = ['2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf',
      '2N6JMWTb79SMh94j82jfMKDSL3wXWkb1MFM', '2NCJs2EA4gwiGJQYpKXoPiebR2vQsBNzdaA',
    ];
    const tData: any = await btc.getTransactionHistory('2NB9kPS83wUZHdFu222vJNXSJXBvVoVgvqc',
      addresses, 'BITCOIN_TESTNET', 0, 50);
    console.log(tData);
  });

  it('can get the balance of a wallet', async () => {
    const wallet: any = btc.generateHDWallet(entropy2, network);
    const addresses: any = ['2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf', '2N6JMWTb79SMh94j82jfMKDSL3wXWkb1MFM', '2NCJs2EA4gwiGJQYpKXoPiebR2vQsBNzdaA',
    ];
    const tData: any = await btc.getBalance(
      addresses, 'BITCOIN_TESTNET',
    );
    console.log(tData);
  });

  // it('can get the unspent transactions of a wallet', async () => {
  //   const addresses = [
  //     '2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf', '2N6JMWTb79SMh94j82jfMKDSL3wXWkb1MFM'];
  //   const tData: any = await btc.getUTXOs(addresses, 'BITCOIN_TESTNET');
  //   console.log(tData);
  // });

  // it('can get the unspent transactions of a litecoin testnet wallet', async () => {
  //   const addresses = [
  //     'QSc9ybA8G55zU5eSGrw32hFBe3R88gkLWc'];
  //   const tData: any = await btc.getUTXOs(addresses, 'BITCOIN_TESTNET');
  //   expect(tData.length).to.equal(1);
  // });

  // it('can create a raw transaction', async () => {
  //   const wallet = btc.generateHDWallet(entropy, 'BITCOIN_TESTNET');
  //   const receiverWallet = btc.generateHDWallet(entropy2, 'BITCOIN_TESTNET');

  //   const addresses = [
  //     '2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf', '2N6JMWTb79SMh94j82jfMKDSL3wXWkb1MFM'];
  //   const utxos: any = await btc.getUTXOs(addresses, 'BITCOIN_TESTNET');
  //   console.log(utxos);

  //   const accounts = [{
  //     address: '2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf',
  //     index: 0,
  //     change: false,
  //   },
  //   {
  //     address: '2N6JMWTb79SMh94j82jfMKDSL3wXWkb1MFM',
  //     index: 1,
  //     change: false,

  //   }];

  //   const change1: any = btc.generateKeyPair(wallet, 0, true);
  //   const change2: any = btc.generateKeyPair(wallet, 1, true);

  //   const change = [
  //     change1.address];

  //   const testAddress: any = btc.generateKeyPair(receiverWallet, 0);
  //   console.log(`To: ${testAddress.address}`);

  //   const tData: any = await btc.createRawTx(
  //     accounts, change, utxos, wallet, testAddress.address, 0.001,
  //   );
  //   console.log(tData);


  //   // const pushTx = await btc.broadcastTx(tData.hexTx, 'BITCOIN_TESTNET');
  //   // console.log('txid :', pushTx);
  // });

  // it('can create a litecoin testnet raw transaction', async () => {
  //   const wallet = btc.generateHDWallet(entropy, 'LITECOIN_TESTNET');
  //   const receiverWallet = btc.generateHDWallet(entropy2, 'LITECOIN_TESTNET');

  //   const addresses = [
  //     'QSc9ybA8G55zU5eSGrw32hFBe3R88gkLWc'];
  //   const utxos: any = await btc.getUTXOs(addresses, 'LITECOIN_TESTNET');


  //   const accounts = [{
  //     address: 'QSc9ybA8G55zU5eSGrw32hFBe3R88gkLWc',
  //     index: 0,
  //     change: false,
  //   }];

  //   const change1: any = btc.generateKeyPair(wallet, 0, true);
  //   const change2: any = btc.generateKeyPair(wallet, 1, true);

  //   const change = [
  //     change1.address];

  //   const testAddress: any = btc.generateKeyPair(receiverWallet, 0);
  //   console.log(`To: ${testAddress.address}`);

  //   const tData: any = await btc.createRawTx(
  //     accounts, change, utxos, wallet, testAddress.address, 0.01,
  //   );
  //   console.log(tData);

  //   const pushTx = await btc.broadcastTx(tData.hexTx, 'LITECOIN_TESTNET');
  //   console.log('txid :', pushTx);
  // });


  // it('can discover an account', async (done) => {
  //   const externalAccountDiscovery: any = await btc.accountDiscovery(
  // testEntropy, 'BITCOIN_TESTNET');
  //   const internalAccountDiscovery: any = await btc.accountDiscovery(
  //     testEntropy, 'BITCOIN_TESTNET', true,
  //   );
  //   console.log(externalAccountDiscovery);
  //   console.log(internalAccountDiscovery);

  //   // expect(externalAccountDiscovery.used.length).to.equal(1);
  // });
});


