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
const invalidEntropy = 'nut mixture license bean page mimic iron spice rail uncover then';
const entropy2 = 'calm steel soccer pulse polar depend bar bargain give pave ancient member';
const testEntropy = 'nest orient spare seek crawl maze must pause grape bird quarter shrimp';
const regtest = 'myth like bonus scare over problem client lizard pioneer submit female collect';

const entro = 'input fancy dilemma valley master body witness actual hat today ceiling idea';

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

  it('can detect an invalid entropy when generating a wallet', () => {
    const badFn = () => btc.generateHDWallet(invalidEntropy, network);
    expect(badFn).to.throw('Invalid entropy');
  });

  it('can detect an invalid network when generating a wallet', () => {
    function badFn() { return btc.generateHDWallet(entropy, 'btcc testnet'); }
    expect(badFn).to.throw('Invalid network');
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

  it('can create a litecoin key pair', () => {
    const wallet: any = btc.generateHDWallet(entropy, 'LITECOIN');
    const keypair: any = btc.generateKeyPair(wallet, 0);
    assert.equal(keypair.address, 'M8d9iWobmxVNo1hHcovnxsUptzn7GGA4SL');
  });

  it('can create a regtest key pair', () => {
    const wallet: any = btc.generateHDWallet(regtest, 'REGTEST');
    const keypair: any = btc.generateKeyPair(wallet, 0);
    assert.equal(keypair.address, 'mnJQyeDFmGjNoxyxKQC6MMFdpx77rYV3Bo');
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

  it('can create a dash testnet key pair', () => {
    const wallet: any = btc.generateHDWallet(entropy, 'DASH_TESTNET');
    const keypair: any = btc.generateKeyPair(wallet, 0);
    assert.equal(keypair.address, 'yWxRFULbGzvNuFafp1jUFNenXbiGrdoNWr');
  });

  it('can detect an invalid wallet type when creating a keypair', () => {
    const wallet: any = btc.generateHDWallet(entropy, 'ETHEREUM');
    const badFn = () => btc.generateKeyPair(wallet, 0);
    expect(badFn).to.throw('Invalid wallet type');
  });

  it('can import a keypair from a WIF', () => {
    const keypair = btc.importWIF('cNJiShRC1rQqQ8MZDtvGWqHJq2sDgErcnq897jq1YMnpCm8JRFXr', network);
    assert.strictEqual(keypair.address, '2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf');
  });

  it('can import a dash testnet keypair from a WIF', () => {
    const keypair = btc.importWIF('cSsfhMdx4kqS2KjkipGr9dNp6Ae1ysjMhZg66in9SVHnYQMCU9jf', 'DASH_TESTNET');
    assert.strictEqual(keypair.address, 'yWxRFULbGzvNuFafp1jUFNenXbiGrdoNWr');
  });

  it('can generate a segwit address', () => {
    const wallet: any = btc.generateHDWallet(entropy, network);
    const keypair: any = btc.generateKeyPair(wallet, 0);
    const segwitAddress: any = btc.generateSegWitAddress(keypair);
    assert.strictEqual(segwitAddress, 'tb1qgmfs2qjff3726j9sy76hpa2mnlnsvv4nnd7zxt');
  });

  it('can validate a bicoin testnet address', () => {
    const wallet = btc.generateHDWallet(entropy, network);
    const ad = btc.validateAddress('2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf', wallet);
    expect(ad).to.equal(true);
  });

  it('can validate a litecoin testnet address', () => {
    const wallet = btc.generateHDWallet(entropy, 'LITECOIN_TESTNET');
    const ad = btc.validateAddress('QSc9ybA8G55zU5eSGrw32hFBe3R88gkLWc', wallet);
    expect(ad).to.equal(true);
  });

  it('can validate an incorrect testnet address', () => {
    const wallet = btc.generateHDWallet(entropy, network);
    const ad = btc.validateAddress('2MyFPraHtEy2uKttPeku1wzokTeyJGTYvkf', wallet);
    expect(ad).to.equal(false);
  });


  // it('can get the transaction history of a wallet', async () => {
  //   // const discover = await btc.accountDiscovery(entro, network);
  //   // const discoverChange = await btc.accountDiscovery(entro, network, true);
  //   // const addresses: any = [];
  //   // discover.active.forEach((addr: any) => {
  //   //   addresses.push(addr.address);
  //   // });

  //   // discoverChange.used.forEach((addr: any) => {
  //   //   addresses.push(addr.address);
  //   // });

  //   const addresses = ['2N3sy5gP2EmDJdxmTv8xBpW1vy6J3oHb6E8',
  //     '2MupXGfAZGfQAoCzcwV6jJGrWmy9pYRHwtc',
  //     '2N2PMJwMoj7TbB1bvGz2gEFwc5ePJzqcu5g',
  //     '2NET9uJ5HYzcAi6C7XMVjBaZA6XXecbYXcw',
  //     '2N9qiz6W6dMepqJ4DNCXwCZfc6W37SbBfNS',
  //     '2MvC3yKmf1qNVHYv7dPfbrk5ivi6WVazo8p',
  //     '2MwToMnT6p5XmdeLyg4McPhW1b4BCY1J9gy',
  //     '2N3jcTuZ584StUYQs9i4rdgv4kTCC3tn7R2',
  //     '2N2nqW915f4UWUPAbCB9yiRZz4NvaXsKd8e',
  //     '2MwToMnT6p5XmdeLyg4McPhW1b4BCY1J9gy',
  //     '2N9qiz6W6dMepqJ4DNCXwCZfc6W37SbBfNS',
  //     '2NET9uJ5HYzcAi6C7XMVjBaZA6XXecbYXcw',
  //     '2N2nqW915f4UWUPAbCB9yiRZz4NvaXsKd8e',
  //     '2Mtis9GmfDSWFcR4c7f1bpe5hujchayejVb',
  //     '2N5867QoMyvdMPJQCS2LShCDVt2bmGaUxfa',
  //     '2NAKtVP3cefduuyQVeD4957izjzcxU44tBj',
  //     '2Mwxzp2KNx9SQUfQTHya8GwGhNUjXv1UBE2',
  //     '2NF3pzVjvvcgCX4F7QUVAmsK7pQwFzG9iGL',
  //     '2NFwvfa68M29y2QpgZDWK6tU4QkhUvCofia',
  //     '2N2CfTWTUT56DTNPDAhDNZc4nw346cv5Nby',
  //     '2N63ZAehL3G5MKYgeEzVQgemWxRywnMt3pW',
  //     '2MwYAWfXtp3isDyVdFbqGSMbQiLx4WBiDYg',
  //     '2NDre37bzB7UeSwWxbsPNEXTaRJYYLKtUVM',
  //     '2MsdVbvf5oQpuZXbRYUzyqcwtBCzTVUZZhz',
  //     '2N9zU9tbzjx6uc1FSkbzXNKFewsV6T9NTN9',
  //     '2MsVWjaNLQh5cggKiVHybSQe2ehyqfLCLuT',
  //     '2N2Y2nrb1t3LUPJKu2Jih1sY8Gn1YDTWJap',
  //     '2NA6ar1wEheAhisGGQhPh9E9nsGHZFYXo2G',
  //     '2MsewYGALzRRNiFsPjKV4K8ssQa8KZqeQws'];

  //   const balance = await btc.getBalance(addresses, network);
  //   console.log('balance :', balance);

  //   // const tData: any = await btc.getTransactionHistory(
  //   //   addresses, 'BITCOIN_TESTNET', 0, 50,
  //   // );
  //   // console.log('txs :', JSON.stringify(tData));
  // });

  // it('can get the transaction history of a wallet', async () => {
  //   const wallet: any = btc.generateHDWallet(entropy2, network);
  //   const addresses: any = ['2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf',
  //     '2N6JMWTb79SMh94j82jfMKDSL3wXWkb1MFM', '2NCJs2EA4gwiGJQYpKXoPiebR2vQsBNzdaA',
  //   ];
  //   const tData: any = await btc.getTransactionHistory(
  //     addresses, 'BITCOIN_TESTNET', 0, 50,
  //   );
  //   console.log(tData);
  // });

  // it('can get the balance of a wallet', async () => {
  //   const wallet: any = btc.generateHDWallet(entropy2, network);
  //   const addresses: any = [
  //     '2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf',
  //     '2N6JMWTb79SMh94j82jfMKDSL3wXWkb1MFM', '2NCJs2EA4gwiGJQYpKXoPiebR2vQsBNzdaA',
  //   ];
  //   const tData: any = await btc.getBalance(
  //     addresses, 'BITCOIN_TESTNET',
  //   );
  //   console.log(tData);
  // });

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


  //   const pushTx = await btc.broadcastTx(tData.hexTx, 'BITCOIN_TESTNET');
  //   console.log('txid :', pushTx);
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


  // it('can create a dash testnet raw transaction', async () => {
  //   const wallet = btc.generateHDWallet(entropy, 'DASH_TESTNET');
  //   const receiverWallet = btc.generateHDWallet(entropy2, 'DASH_TESTNET');

  //   const addresses = [
  //     'yWxRFULbGzvNuFafp1jUFNenXbiGrdoNWr', 'yifJaS4dzhySqAWmFfm3E2gaysZRQmaJix'];
  //   const utxos: any = await btc.getUTXOs(addresses, 'DASH_TESTNET');


  //   const accounts = [{
  //     address: 'yWxRFULbGzvNuFafp1jUFNenXbiGrdoNWr',
  //     index: 0,
  //     change: false,
  //   },
  //   {
  //     address: 'yifJaS4dzhySqAWmFfm3E2gaysZRQmaJix',
  //     index: 0,
  //     change: true,
  //   }];

  //   const change1: any = btc.generateKeyPair(wallet, 0, true);
  //   const change2: any = btc.generateKeyPair(wallet, 1, true);

  //   const change = [
  //     change1.address];

  //   const testAddress: any = btc.generateKeyPair(receiverWallet, 0);
  //   console.log(`To: ${testAddress.address}`);

  //   const tData: any = await btc.createRawTx(
  //     accounts, change, utxos, wallet, testAddress.address, 0.1,
  //   );
  //   console.log(tData);

  //   const pushTx = await btc.broadcastTx(tData.hexTx, 'DASH_TESTNET');
  //   console.log('txid :', pushTx);
  // });


  it('can discover an account', async (done) => {
    const externalAccountDiscovery: any = await btc.accountDiscovery(
      regtest, 'REGTEST',
    );
    const internalAccountDiscovery: any = await btc.accountDiscovery(
      regtest, 'REGTEST', true,
    );
    console.log(externalAccountDiscovery);
    console.log(internalAccountDiscovery);

    // expect(externalAccountDiscovery.used.length).to.equal(1);
  });
});


