/* eslint-disable import/no-unresolved */
import * as Mocha from 'mocha';
import * as Chai from 'chai';
import * as Bitcoin from 'bitcoinjs-lib';
import * as series from 'async-series';
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

const testAddresses = ['2N3sy5gP2EmDJdxmTv8xBpW1vy6J3oHb6E8',
  '2MupXGfAZGfQAoCzcwV6jJGrWmy9pYRHwtc',
  '2N2PMJwMoj7TbB1bvGz2gEFwc5ePJzqcu5g',
  '2NET9uJ5HYzcAi6C7XMVjBaZA6XXecbYXcw',
  '2N9qiz6W6dMepqJ4DNCXwCZfc6W37SbBfNS',
  '2MvC3yKmf1qNVHYv7dPfbrk5ivi6WVazo8p',
  '2MwToMnT6p5XmdeLyg4McPhW1b4BCY1J9gy',
  '2N3jcTuZ584StUYQs9i4rdgv4kTCC3tn7R2',
  '2N2nqW915f4UWUPAbCB9yiRZz4NvaXsKd8e',
  '2MwToMnT6p5XmdeLyg4McPhW1b4BCY1J9gy',
  '2N9qiz6W6dMepqJ4DNCXwCZfc6W37SbBfNS',
  '2NET9uJ5HYzcAi6C7XMVjBaZA6XXecbYXcw',
  '2N2nqW915f4UWUPAbCB9yiRZz4NvaXsKd8e',
  '2Mtis9GmfDSWFcR4c7f1bpe5hujchayejVb',
  '2N5867QoMyvdMPJQCS2LShCDVt2bmGaUxfa',
  '2NAKtVP3cefduuyQVeD4957izjzcxU44tBj',
  '2Mwxzp2KNx9SQUfQTHya8GwGhNUjXv1UBE2',
  '2NF3pzVjvvcgCX4F7QUVAmsK7pQwFzG9iGL',
  '2NFwvfa68M29y2QpgZDWK6tU4QkhUvCofia',
  '2N2CfTWTUT56DTNPDAhDNZc4nw346cv5Nby',
  '2N63ZAehL3G5MKYgeEzVQgemWxRywnMt3pW',
  '2MwYAWfXtp3isDyVdFbqGSMbQiLx4WBiDYg',
  '2NDre37bzB7UeSwWxbsPNEXTaRJYYLKtUVM',
  '2MsdVbvf5oQpuZXbRYUzyqcwtBCzTVUZZhz',
  '2N9zU9tbzjx6uc1FSkbzXNKFewsV6T9NTN9',
  '2MsVWjaNLQh5cggKiVHybSQe2ehyqfLCLuT',
  '2N2Y2nrb1t3LUPJKu2Jih1sY8Gn1YDTWJap',
  '2NA6ar1wEheAhisGGQhPh9E9nsGHZFYXo2G',
  '2MsewYGALzRRNiFsPjKV4K8ssQa8KZqeQws'];


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

  it('can create a 3 of 4 multisig address', () => {
    const address: any = btc.generateSegWit3of4MultiSigAddress(
      '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
      '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
      '023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59',
      '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9', 'BITCOIN',
    );
    assert.strictEqual(address.address, 'bc1q75f6dv4q8ug7zhujrsp5t0hzf33lllnr3fe7e2pra3v24mzl8rrqtp3qul');
  });

  it('can create a P2SH multisig address', () => {
    const address: any = btc.gernerateP2SHMultiSig(
      ['026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
        '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9'], 'BITCOIN',
    );
    assert.strictEqual(address.address, '3P4mrxQfmExfhxqjLnR2Ah4WES5EB1KBrN');
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
    const ad = btc.validateAddress('2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf', 'BITCOIN_TESTNET');
    expect(ad).to.equal(true);
  });

  it('can validate a litecoin testnet address', () => {
    const ad = btc.validateAddress('QSc9ybA8G55zU5eSGrw32hFBe3R88gkLWc', 'LITECOIN_TESTNET');
    expect(ad).to.equal(true);
  });

  it('can validate an incorrect testnet address', () => {
    const ad = btc.validateAddress('2MyFPraHtEy2uKttPeku1wzokTeyJGTYvkf', 'BITCOIN_TESTNET');
    expect(ad).to.equal(false);
  });

  it('can get the transaction history of a wallet', async () => {
    const tData: any = await btc.getTransactionHistory(
      testAddresses, 'BITCOIN_TESTNET', 0, 50,
    );
    expect(tData.txs.length).to.equal(31);
  });

  it('throws an error when passed an invalid address in getTransactionHistory', async () => {
    const badFn = () => btc.getTransactionHistory(
      ['bad address'], 'BITCOIN_TESTNET', 0, 50,
    );
    expect(badFn).to.throw('Invalid address used');
  });

  it('throws an error when passed an invalid network in getTransactionHistory', async () => {
    const badFn = () => btc.getTransactionHistory(
      testAddresses, 'ETHEREUM', 0, 50,
    );
    expect(badFn).to.throw('Invalid network type');
  });

  it('can get the balance of a wallet', async () => {
    const tData: any = await btc.getBalance(
      testAddresses, 'BITCOIN_TESTNET',
    );
    expect(tData).to.equal(0.23612026);
  });

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


  it('can get the unspent transactions of a wallet', async () => {
    const addresses = [
      '2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf', '2N6JMWTb79SMh94j82jfMKDSL3wXWkb1MFM'];
    const tData: any = await btc.getUTXOs(addresses, 'BITCOIN_TESTNET');
    expect(tData.length).to.equal(11);
  });

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


  // it('can discover an account', async (done) => {
  //   const externalAccountDiscovery: any = await btc.accountDiscovery(
  //     'capable banner bubble rather wet pull diary produce you grace document ridge', 'REGTEST',
  //   );
  //   const internalAccountDiscovery: any = await btc.accountDiscovery(
  //     'capable banner bubble rather wet pull diary produce you grace document ridge',
  // 'REGTEST', true,
  //   );
  //   console.log(externalAccountDiscovery);
  //   console.log(internalAccountDiscovery);

  //   // expect(externalAccountDiscovery.used.length).to.equal(1);
  // });

  // it('can create a raw transaction', async () => {
  //   const wallet = btc.generateHDWallet(regtest, 'REGTEST');
  //   const receiverWallet = btc.generateHDWallet(entropy2, 'REGTEST');

  //   const addresses = [
  //     'mnJQyeDFmGjNoxyxKQC6MMFdpx77rYV3Bo', 'mzdF3oEx8mKrpGb5rVnTE7MhQfL8N8oSnW',
  //     'mtdVMhiWWmegkkBhzYDrz84yfgofPNLNmb',
  //     'mqNnZTyFxhB6EzF1iDEAp9enrT84fwd1X5',
  //     'mnk2URqujBqMEfhALMby1WZHoBRauW37Kg'];
  //   const utxos: any = await btc.getUTXOs(addresses, 'REGTEST');


  //   const accounts = [{
  //     address: 'mnJQyeDFmGjNoxyxKQC6MMFdpx77rYV3Bo',
  //     index: 0,
  //     change: false,
  //   },
  //   {
  //     address: 'mzdF3oEx8mKrpGb5rVnTE7MhQfL8N8oSnW',
  //     index: 1,
  //     change: false,
  //   },
  //   {
  //     address: 'mtdVMhiWWmegkkBhzYDrz84yfgofPNLNmb',
  //     index: 2,
  //     change: false,
  //   },
  //   {
  //     address: 'mqNnZTyFxhB6EzF1iDEAp9enrT84fwd1X5',
  //     index: 3,
  //     change: false,
  //   },
  //   {
  //     address: 'mnk2URqujBqMEfhALMby1WZHoBRauW37Kg',
  //     index: 4,
  //     change: false,
  //   },
  //   {
  //     address: 'mnJQyeDFmGjNoxyxKQC6MMFdpx77rYV3Bo',
  //     received: 131.39085,
  //     balance: 131.39085,
  //     index: 0,
  //     change: true,
  //   },
  //   {
  //     address: 'mzdF3oEx8mKrpGb5rVnTE7MhQfL8N8oSnW',
  //     received: 37.8582,
  //     balance: 12.447,
  //     index: 1,
  //     change: true,
  //   },
  //   {
  //     address: 'mtdVMhiWWmegkkBhzYDrz84yfgofPNLNmb',
  //     received: 69.7722,
  //     balance: 69.7722,
  //     index: 2,
  //     change: true,
  //   },
  //   {
  //     address: 'mqNnZTyFxhB6EzF1iDEAp9enrT84fwd1X5',
  //     received: 37.4912,
  //     balance: 6.2567,
  //     index: 3,
  //     change: true,
  //   },
  //   {
  //     address: 'mnk2URqujBqMEfhALMby1WZHoBRauW37Kg',
  //     received: 15.2567,
  //     balance: 1.123,
  //     index: 4,
  //     change: true,
  //   }];

  //   const change1: any = btc.generateKeyPair(wallet, 0);
  //   // const change2: any = btc.generateKeyPair(wallet, 1, true);

  //   const change = [
  //     change1.address];


  //   const tData: any = await btc.createRawTx(
  //     accounts, change, utxos, wallet, 'n1Fbz1krLPDWNNwRHeFCDBjWcwfpf6TA74', 5, 30,
  //   );
  //   console.log(tData);


  //   const pushTx = await btc.broadcastTx(tData.hexTx, 'REGTEST');
  //   console.log('txid :', pushTx);
  // });

  // it('can send a transaction to many addresses', async () => {
  //   const wallet = btc.generateHDWallet(regtest, 'REGTEST');
  //   const sendWallet = btc.generateHDWallet(entropy, 'REGTEST');
  //   const account = btc.generateAddress(wallet, 0, false);
  //   const one = 'n1Fbz1krLPDWNNwRHeFCDBjWcwfpf6TA74';
  //   const two = 'mxqH9hZvsS7Pi9KyjkibF9Gesgykaywu8a';

  //   const { address } = account;
  //   const utxos: any = await btc.getUTXOs([address], 'REGTEST');
  //   const tx = await btc.createTxToMany(
  //  [account], [address], utxos, wallet, [one, two], [4, 2], 30);
  //   console.log('tx :', tx);
  // });

  // it('can simulate 1000 transactions on a wallet', async () => {
  //   const mnemonic1 =
  // 'capable banner bubble rather wet pull diary produce you grace document ridge';
  //   const mnemonic2 =
  // 'humor clarify mesh curious slow inject envelope mutual express fox once family';
  //   const wallet1 = btc.generateHDWallet(mnemonic1, 'REGTEST');
  //   const wallet2 = btc.generateHDWallet(mnemonic2, 'REGTEST');
  //   let accounts1: any = [];
  //   let accounts2: any = [];
  //   let addresses1: any = [];
  //   let addresses2: string[] = [];
  //   let changeIndex1 = 0;
  //   let changeIndex2 = 0;
  //   let externalIndex1 = 0;
  //   let externalIndex2 = 0;

  //   const sendTransaction = async () => new Promise(async (resolve, reject) => {
  //     const external1: any = btc.generateAddress(wallet1, externalIndex1);
  //     const internal1 = btc.generateAddress(wallet1, changeIndex1, true);
  //     const external2 = btc.generateAddress(wallet2, externalIndex2);
  //     const internal2 = btc.generateAddress(wallet2, changeIndex2, true);

  //     for (let i = 1; i < 10; i += 1) {
  //       const ex1: any = btc.generateAddress(wallet1, i);
  //       const ex2: any = btc.generateAddress(wallet2, i);
  //       const in1: any = btc.generateAddress(wallet1, i);
  //       const in2: any = btc.generateAddress(wallet2, i);

  //       accounts1.push(ex1);
  //       addresses1.push(ex1.address);
  //       // add change account to accounts and address arrays
  //       accounts1.push(in1);
  //       addresses1.push(in1.address);
  //     }

  //     // add external account to address and accounts arrays
  //     accounts1.push(external1);
  //     addresses1.push(external1.address);
  //     // add change account to accounts and address arrays
  //     accounts1.push(internal1);
  //     addresses1.push(internal1.address);

  //     const UTXOS1 = await btc.getUTXOs(addresses1, 'REGTEST'); // get utxos account1
  //     const transaction1 = await btc.createRawTx(
  //       accounts1, [internal1.address], UTXOS1, wallet1, external2.address, 0.03, 38,
  //     );// create transaction 1
  //     console.log('transaction1.hexTx :', transaction1.hexTx);
  //     const pushTx1 = await btc.broadcastTx(transaction1.hexTx,
  //  'REGTEST');// broadcast transaction
  //     console.log('tx :', pushTx1);
  //     // next change address
  //     changeIndex1 += 1;
  //     externalIndex2 += 1;


  //     // remove input from the arrays if it was a change address
  //     if (transaction1.changeInputUsed.length > 0) {
  //       transaction1.changeInputUsed.forEach((tran: any) => {
  //         addresses1 = addresses1.filter((item: any) => {
  //           if (item === tran.address) return false;
  //           return true;
  //         });
  //         accounts1 = accounts1.filter((item: any) => {
  //           if (item.address === tran.address) return false;
  //           return true;
  //         });
  //       });
  //     }


  //     accounts2.push(external2);
  //     addresses2.push(external2.address);
  //     accounts1.push(internal2);
  //     addresses1.push(internal2.address);

  //     const UTXOS2 = await btc.getUTXOs(addresses2, 'REGTEST');
  //     const transaction2 = await btc.createRawTx(
  //       accounts2, [internal2.address], UTXOS2, wallet2, external1.address, 0.01, 38,
  //     );
  //     const pushTx2 = await btc.broadcastTx(transaction2.hexTx, 'REGTEST');

  //     console.log('tx :', pushTx2);
  //     changeIndex2 += 1;
  //     externalIndex1 += 1;


  //     if (transaction2.changeInputUsed.length > 0) {
  //       transaction2.changeInputUsed.forEach((tran: any) => {
  //         addresses2 = addresses2.filter((item: any) => {
  //           if (item === tran.address) return false;
  //           return true;
  //         });
  //         accounts2 = accounts2.filter((item: any) => {
  //           if (item.address === tran.address) return false;
  //           return true;
  //         });
  //       });
  //     }

  //     resolve();
  //   });

  //   const promises: any = [];
  //   for (let i = 0; i < 10; i += 1) {
  //     promises.push(async (callback: any) => { await sendTransaction(); callback(); });
  //   }

  //   await series(promises, () => console.log('finished'));
  // });


  //   const transaction = btc.createRawTx();
  // });

  // it('can get the transaction fee rate', async () => {
  //   const feeRate = await btc.getTransactionFee('BITCOIN_TESTNET');
  //   console.log('feeRate :', feeRate);
  // });
});


