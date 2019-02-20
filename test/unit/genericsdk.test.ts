/* eslint-disable import/no-unresolved */
import 'jest';
import { KeyPair } from 'src/SDKS/GenericSDK.d';
import axios from 'axios';
import * as request from 'request';
import { CryptoWallet } from '../../src/SDKFactory';

jest.mock('axios');
jest.mock('request');
const mockAxios: any = axios;
// const mockRequest: any = request;

const btc: any = CryptoWallet.createSDK('Bitcoin');

const entropy = 'nut mixture license bean page mimic iron spice rail uncover then warfare';
const invalidEntropy = 'nut mixture license bean page mimic iron spice rail uncover then';
const entropy2 = 'calm steel soccer pulse polar depend bar bargain give pave ancient member';
const testEntropy = 'nest orient spare seek crawl maze must pause grape bird quarter shrimp';
const regtest = 'myth like bonus scare over problem client lizard pioneer submit female collect';
const testWallet1 = 'sorry stage resource neglect boat kind size spike vanish what begin often';
const testWallet2 = 'garage grunt armor reflect exchange success old undo chef glimpse vanish syrup';

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
  describe('generateHDWallet', () => {
    it('can generate a BTC testnet HD wallet', () => {
      const wallet: any = btc.generateHDWallet(entropy, 'BITCOIN_TESTNET');
      const keypair: any = btc.generateKeyPair(wallet, 0);
      expect(wallet.external.xpriv).toBe('xprvA1zR34Tm9KnyfTxTd9n7m7Q1gMauEKPNzdRL7nfF3cGYiwLYd9xmPJBdRGfL6tu4U46oQf4FhjG2ysih1e5Wfa7ia6W8ZhrLUEcKAjUqLNs');
      expect(wallet.external.xpub).toBe('xpub6EymSZzeyhMGsx2vjBK88FLkEPRPdn7EMrLvvB4rbwoXbjfhAhH1w6W7GY7MY2nMfp4ebihHWYh5wg2U4wQX3c9JUTndGAa2JjjrZY1f3dc');
      expect(wallet.bip).toBe(bip);
      expect(wallet.type).toBe(1);
    });

    it('can generate a regtest HD wallet', () => {
      const wallet: any = btc.generateHDWallet(entropy, 'REGTEST');
      expect(wallet.external.xpriv).toBe('xprv9uZZn2GG7khoyKSKnxBnwc1G9YcrSAtVZ7ohwxwDWUJDfWNHqZE4vUWjbbrXmhCzTERyzWzwuobfkwM1ZiG9DQBXwjEAA3wraqcU1do4Rir');
      expect(wallet.external.xpub).toBe('xpub68YvBXo9x8G7BoWntyioJjwzhaTLqdcLvLjJkMLq4oqCYJhSP6YKUGqDSsu1aQSejM9xxApK67fzupboqQ8TkXeAb81ySQj2yC4f1MfrTg8');
      expect(wallet.bip).toBe(0);
      expect(wallet.type).toBe(0);
    });

    it('can generate a Litecoin HD wallet', () => {
      const wallet: any = btc.generateHDWallet(entropy, 'LITECOIN');
      expect(wallet.external.xpriv).toBe('xprv9zZDbfbjnMv81DYDd79G8BGHa6y9aEbUwYoXjGVQdW4MxJw4XpE5CGmRcbXcFMW3AmZh3GZr8Lj6fQUPs46s5rgj7BgY21XsNV4RKvewxAq');
      expect(wallet.external.xpub).toBe('xpub6DYa1B8dcjURDhcgj8gGVKD288odyhKLJmj8Xeu2BqbLq7GD5MYKk55uTsw1T9n2QvQRrgbW4n465CZUQsVekBGKQQ5mpphqy97Vhe9j8Pg');
      expect(wallet.bip).toBe(49);
      expect(wallet.type).toBe(2);
    });

    it('can generate a Dash HD wallet', () => {
      const wallet: any = btc.generateHDWallet(entropy, 'DASH');
      expect(wallet.external.xpriv).toBe('xprvA1WARJ2YwFfriS6eQHWBWecQYd6VPt5c7safPbLeiNsHct9pSTeZZe3oV3CkVK6KHrxfp44w3phNcfJDxvvQSd5TJcotRWkcRkhetQQGz7f');
      expect(wallet.external.xpub).toBe('xpub6EVWpoZSmdE9vvB7WK3BsnZ96evyoLoTV6WGBykGGiQGVgUxyzxp7SNHLM8V79Y9jvF91TRnUwyFiDmUotWWopsgGdWURkT6sscFHaouoQ1');
      expect(wallet.bip).toBe(44);
      expect(wallet.type).toBe(5);
    });

    it('can detect an invalid entropy when generating a wallet', () => {
      const badFn = () => btc.generateHDWallet(invalidEntropy, network);
      expect(badFn).toThrow('Invalid entropy');
    });

    it('can detect an invalid network when generating a wallet', () => {
      function badFn() { return btc.generateHDWallet(entropy, 'btcc testnet'); }
      expect(badFn).toThrow('Invalid network');
    });
  });

  describe('generateKeyPair', () => {
    it('can create an external btc testnet key pair', () => {
      const wallet: any = btc.generateHDWallet(entropy, network);
      const keypair: KeyPair = btc.generateKeyPair(wallet, 0);
      expect(keypair.derivationPath).toBe(derPath);
      expect(keypair.address).toBe('2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf');
      expect(
        keypair.publicKey,
      ).toBe('03f3ce9fafbcf2da98817a706e5d41272455df20b8f832f6700c1bb2652ac44de0');
      expect(
        keypair.privateKey,
      ).toBe('cNJiShRC1rQqQ8MZDtvGWqHJq2sDgErcnq897jq1YMnpCm8JRFXr');
      expect(keypair.type).toBe('BITCOIN_TESTNET');
    });

    it('can create an internal btc testnet key pair', () => {
      const wallet: any = btc.generateHDWallet(entropy, network);
      const keypair: KeyPair = btc.generateKeyPair(wallet, 0, true);
      // expect(keypair.derivationPath).toBe('m/49\'/1\'/0\'/1/0');
      expect(keypair.address).toBe('2NCJs2EA4gwiGJQYpKXoPiebR2vQsBNzdaA');
      expect(
        keypair.publicKey,
      ).toBe('020526d00a6c48f0f016afc4b996cdace8e4f112d2d51b946161d4bec732f0c8b2');
      expect(
        keypair.privateKey,
      ).toBe('cSueohr8ghpDSHPsBAeStxc3Hcb2isXZFebgBHRZivhPHjyZcDSK');
      expect(keypair.type).toBe('BITCOIN_TESTNET');
    });

    it('can create a litecoin key pair', () => {
      const wallet: any = btc.generateHDWallet(entropy, 'LITECOIN');
      const keypair: any = btc.generateKeyPair(wallet, 0);
      expect(keypair.address).toBe('M8d9iWobmxVNo1hHcovnxsUptzn7GGA4SL');
    });

    it('can create a regtest key pair', () => {
      const wallet: any = btc.generateHDWallet(regtest, 'REGTEST');
      const keypair: any = btc.generateKeyPair(wallet, 0);
      expect(keypair.address).toBe('mnJQyeDFmGjNoxyxKQC6MMFdpx77rYV3Bo');
    });

    it('can create a litecoin testnet key pair', () => {
      const wallet: any = btc.generateHDWallet(entropy, 'LITECOIN_TESTNET');
      const keypair: any = btc.generateKeyPair(wallet, 0);
      expect(keypair.address).toBe('QSc9ybA8G55zU5eSGrw32hFBe3R88gkLWc');
    });

    it('can create a dogecoin key pair', () => {
      const wallet: any = btc.generateHDWallet(entropy, 'DOGECOIN');
      const keypair: any = btc.generateKeyPair(wallet, 0);
      expect(keypair.address).toBe('DTaFz5tzRjvk38e5La2Egrahat1V67Dk5k');
    });

    it('can create a dash key pair', () => {
      const wallet: any = btc.generateHDWallet(entropy, 'DASH');
      const keypair: any = btc.generateKeyPair(wallet, 0);
      expect(keypair.address).toBe('XwzcnQSMZRhZDcNZZmskLB2ztiJnsD26vG');
    });

    it('can create a dash testnet key pair', () => {
      const wallet: any = btc.generateHDWallet(entropy, 'DASH_TESTNET');
      const keypair: any = btc.generateKeyPair(wallet, 0);
      expect(keypair.address).toBe('yWxRFULbGzvNuFafp1jUFNenXbiGrdoNWr');
    });

    it('can detect an invalid wallet type when creating a keypair', () => {
      const wallet: any = btc.generateHDWallet(entropy, 'ETHEREUM');
      const badFn = () => btc.generateKeyPair(wallet, 0);
      expect(badFn).toThrow('Invalid wallet type');
    });
  });

  describe('generateAddress', () => {
    it('can create an external btc testnet address', () => {
      const wallet: any = btc.generateHDWallet(entropy, network);
      const account: any = btc.generateAddress(wallet, 0);
      expect(account.address).toBe('2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf');
      expect(account.index).toBe(0);
      expect(account.type).toBe('BITCOIN_TESTNET');
    });

    it('can create an internal btc testnet address', () => {
      const wallet: any = btc.generateHDWallet(entropy, network);
      const account: any = btc.generateAddress(wallet, 0, true);
      expect(account.address).toBe('2NCJs2EA4gwiGJQYpKXoPiebR2vQsBNzdaA');
      expect(account.index).toBe(0);
      expect(account.type).toBe('BITCOIN_TESTNET');
      expect(account.change).toBe(true);
    });

    it('can create an external Dash address', () => {
      const wallet: any = btc.generateHDWallet(entropy, 'DASH');
      const account: any = btc.generateAddress(wallet, 0);
      expect(account.address).toBe('XwzcnQSMZRhZDcNZZmskLB2ztiJnsD26vG');
      expect(account.index).toBe(0);
      expect(account.type).toBe('DASH');
    });

    it('can detect an invalid wallet type when creating a keypair', () => {
      const wallet: any = btc.generateHDWallet(entropy, 'ETHEREUM');
      const badFn = () => btc.generateAddress(wallet, 0);
      expect(badFn).toThrow('Invalid wallet type');
    });
  });

  describe('importWif', () => {
    it('can import a keypair from a WIF', () => {
      const keypair = btc.importWIF('cNJiShRC1rQqQ8MZDtvGWqHJq2sDgErcnq897jq1YMnpCm8JRFXr', network);
      expect(keypair.address).toBe('2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf');
    });

    it('can import a dash testnet keypair from a WIF', () => {
      const keypair = btc.importWIF('cSsfhMdx4kqS2KjkipGr9dNp6Ae1ysjMhZg66in9SVHnYQMCU9jf', 'DASH_TESTNET');
      expect(keypair.address).toBe('yWxRFULbGzvNuFafp1jUFNenXbiGrdoNWr');
    });

    it('can detect an invalid network type when importing a WIF', () => {
      function badFn() { return btc.importWIF('cNJiShRC1rQqQ8MZDtvGWqHJq2sDgErcnq897jq1YMnpCm8JRFXr', 'ETHEREUM'); }
      expect(badFn).toThrow('Invalid network type');
    });
  });

  describe('validateAddress', () => {
    it('can confirm a bitcoin testnet address is valid', () => {
      const valid = btc.validateAddress('2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf', network);
      expect(valid).toBe(true);
    });

    it('can confirm a bitcoin testnet address is not valid', () => {
      const valid = btc.validateAddress('2MyFPraHtEy2uKttPeku1okVeyJGTYvkf', network);
      expect(valid).toBe(false);
    });
  });

  // describe('broadcastTx', () => {
  //   it('can broadcast a bitcoin tx', async () => {
  //     request.post.mockResolvedValue({
  //       error: null,
  //       body: {},
  //       result: JSON.stringify({ data: { txid: '000000' } }),
  //     });
  //     const txHash = await btc.broadcastTx('txHex', 'BITCOIN');
  //     console.log('txHash :', txHash);
  //   });
  // });

  describe('getTransactionFee', () => {
    it('can get the transacion fee for a bitcoin transaction', async () => {
      // eslint-disable-next-line prefer-const
      const responseObj = {
        data: {
          name: 'BTC.main',
          height: 563742,
          hash: '00000000000000000008c64fae18b54a1a9dc6517779dd5789cea6178c22b40b',
          time: '2019-02-19T09:38:37.353246671Z',
          latest_url: 'https://api.blockcypher.com/v1/btc/main/blocks/00000000000000000008c64fae18b54a1a9dc6517779dd5789cea6178c22b40b',
          previous_hash: '00000000000000000002e30187633e89d13618a43e8f40647dedfdbac5320dc5',
          previous_url: 'https://api.blockcypher.com/v1/btc/main/blocks/00000000000000000002e30187633e89d13618a43e8f40647dedfdbac5320dc5',
          peer_count: 783,
          unconfirmed_count: 2677,
          high_fee_per_kb: 21569,
          medium_fee_per_kb: 12000,
          low_fee_per_kb: 3000,
          last_fork_height: 562630,
          last_fork_hash: '0000000000000000000a03b17c49727b1df86200f228bfa71e3a38420c4b2151',
        },
      };
      mockAxios.get.mockResolvedValue(responseObj);

      const fee = await btc.getTransactionFee('BITCOIN');

      expect(fee).toEqual({
        high: 21.569,
        medium: 12,
        low: 3,
      });
    });

    it('can detect an invalid network', async () => {
      expect(() => btc.getTransactionFee('bitocin')).toThrow('Invalid network');
    });

    it('can get the transacion fee for a bitcoin transaction', async () => {
      // eslint-disable-next-line prefer-const
      mockAxios.get.mockResolvedValue(() => { throw new Error('some error'); });

      return expect(btc.getTransactionFee('BITCOIN')).rejects.toMatch('Cannot read property \'high_fee_per_kb\' of undefined');
    });
  });


  describe('createRawTx', () => {
    const wallet: any = btc.generateHDWallet(entropy, network);
    const utxo = [{
      address: '2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf',
      txid: '48d2bc7293fe1b1b3c74b1276861c3ab1a63a01fbf87789c192f3491422e9dbf',
      vout: 82,
      scriptPubKey: 'a91441d8fdc7c1218b669e29928a209cd2d4df70ca9687',
      amount: 0.17433129,
      satoshis: 17433129,
      height: 1448809,
      confirmations: 29673,
      value: 17433129,
    }];

    const accounts = [{
      address: '2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf',
      index: 0,
      change: false,
    }];
    it('can create a bitcoin raw transaction', async () => {
      // mockAxios.get.mockResolvedValue({
      //   data: [{
      //     address: '2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf',
      //     txid: '48d2bc7293fe1b1b3c74b1276861c3ab1a63a01fbf87789c192f3491422e9dbf',
      //     vout: 82,
      //     scriptPubKey: 'a91441d8fdc7c1218b669e29928a209cd2d4df70ca9687',
      //     amount: 0.17433129,
      //     satoshis: 17433129,
      //     height: 1448809,
      //     confirmations: 29673,
      //   }],
      // });
      // const utxos = await btc.getUTXOs(['2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf'], network);


      const rawTx = await btc.createRawTx(
        accounts,
        ['2NCJs2EA4gwiGJQYpKXoPiebR2vQsBNzdaA'],
        utxo,
        wallet,
        '2NB9kPS83wUZHdFu222vJNXSJXBvVoVgvqc',
        0.1,
        36,
      );
      expect(rawTx.transaction.hash)
        .toBe('0d81aede72b1792972f79e6be39af24431791a0154603f03b004baaeaab9b64f');
    });


    it('can create a bitcoin raw transaction sending the full balance', async () => {
      const rawTx = await btc.createRawTx(
        accounts,
        ['2NCJs2EA4gwiGJQYpKXoPiebR2vQsBNzdaA'],
        utxo,
        wallet,
        '2NB9kPS83wUZHdFu222vJNXSJXBvVoVgvqc',
        0.1,
        36,
        true,
      );

      expect(rawTx.transaction.hash)
        .toBe('1230c8f09e5f11eb3393a1decac8da8096de372eab9c2963af2a40c8f064159f');
    });

    it('can create a bitcoin raw transaction with more than one change address', async () => {
      const rawTx = await btc.createRawTx(
        accounts,
        ['2NCJs2EA4gwiGJQYpKXoPiebR2vQsBNzdaA',
          '2NDbQDbR89XMTbTDSzfWUS93DXbywDqYCtH'],
        utxo,
        wallet,
        '2NB9kPS83wUZHdFu222vJNXSJXBvVoVgvqc',
        0.1,
        36,
      );

      expect(rawTx.transaction.hash)
        .toBe('d8b8746a6065450e1cf990ccba23f44eb15328be84635a813f7ac2732d6a3cde');
    });

    it('can create a bitcoin raw transaction with a utxo from a change address', async () => {
      const changeWallet: any = btc.generateHDWallet(entropy, network);
      const changeUtxo = [{
        address: '2NCJs2EA4gwiGJQYpKXoPiebR2vQsBNzdaA',
        txid: '065d03223107ec468c4dd373b793b604968388cbfbc62f770f6d42a197e6c246',
        vout: 1,
        scriptPubKey: 'a914d11a8d42832ff79dad1e902f814a876d43eca05587',
        amount: 0.00098424,
        satoshis: 98424,
        height: 1447518,
        confirmations: 31030,
        value: 98424,
      }];

      const changeAccounts = [{
        address: '2NCJs2EA4gwiGJQYpKXoPiebR2vQsBNzdaA',
        index: 0,
        change: true,
      }];

      const rawTx = await btc.createRawTx(
        changeAccounts,
        ['2NDbQDbR89XMTbTDSzfWUS93DXbywDqYCtH'],
        changeUtxo,
        changeWallet,
        '2NB9kPS83wUZHdFu222vJNXSJXBvVoVgvqc',
        0.0005,
        36,
      );

      expect(rawTx.transaction.hash)
        .toBe('26feaebdbcf3bf479b68d50bdf34828d763f948a11d8b9eac1476752e83665db');
    });

    it('can create a Dash testnet raw transaction', async () => {
      const dashWallet: any = btc.generateHDWallet(entropy, 'DASH_TESTNET');
      const dashUtxo = [{
        address: 'yWxRFULbGzvNuFafp1jUFNenXbiGrdoNWr',
        txid: 'ca6f45c6105e924df1ec6cc48ae8634e8e802fd7a039584d0e6d252ee981e73d',
        vout: 0,
        scriptPubKey: 'a914d11a8d42832ff79dad1e76a91474af505593334219ac81a2fa6f165f02ce7049d588ac902f814a876d43eca05587',
        amount: 189.3686,
        satoshis: 189368600000,
        height: 47586,
        confirmations: 3,
        value: 189368600000,
      }];

      const dashAccounts = [{
        address: 'yWxRFULbGzvNuFafp1jUFNenXbiGrdoNWr',
        index: 0,
        change: false,
      }];

      const rawTx = await btc.createRawTx(
        dashAccounts,
        ['yifJaS4dzhySqAWmFfm3E2gaysZRQmaJix'],
        dashUtxo,
        dashWallet,
        'yc1v3o1TkA5TUKntjFriDcoRBKgJ4hutZM',
        5,
        36,
      );
      expect(rawTx.transaction.hash)
        .toBe('47c66d94ae1bf2d228909814a14780628a0a0d71b7011046c8c608960883b5f8');
    });

    it('can detect an invalid wallet object', async () => {
      expect(() => btc.createRawTx(
        accounts,
        ['2NCJs2EA4gwiGJQYpKXoPiebR2vQsBNzdaA'],
        utxo,
        'wallet',
        '2NB9kPS83wUZHdFu222vJNXSJXBvVoVgvqc',
        0.1,
        36,
      )).toThrow('Invalid wallet type');
    });

    it('can detect an invalid address when creating a transaction', async () => {
      expect(() => btc.createRawTx(
        accounts,
        ['2NCJs2EA4gwiGJQYpKXoPiebR2vQsBNzdaA'],
        utxo,
        wallet,
        '2NB9kPS83wUZHdFu222vJNXSJXBvVoVgvq',
        0.1,
        36,
      )).toThrow('Invalid to address "2NB9kPS83wUZHdFu222vJNXSJXBvVoVgvq"');
    });

    it('can detect when there is no balance when creating a transaction', async () => {
      const emptyUtxo:any = [];
      expect(btc.createRawTx(
        accounts,
        ['2NCJs2EA4gwiGJQYpKXoPiebR2vQsBNzdaA'],
        emptyUtxo,
        wallet,
        '2NB9kPS83wUZHdFu222vJNXSJXBvVoVgvqc',
        0.1,
        36,
      )).rejects.toMatch('You don\'t have enough balance to cover transaction');
    });

    it('can detect when there is not enough balance to cover the transaction', async () => {
      expect(btc.createRawTx(
        accounts,
        ['2NCJs2EA4gwiGJQYpKXoPiebR2vQsBNzdaA'],
        utxo,
        wallet,
        '2NB9kPS83wUZHdFu222vJNXSJXBvVoVgvqc',
        1,
        36,
      )).rejects.toMatch('You don\'t have enough Satoshis to cover the miner fee.');
    });
  });

  // describe('verifyTxSignature', () => {
  //   it('verify a bitcoin transaction signature', () => {
  //     const valid = btc.verifyTxSignature(transaction, network);
  //   });
  // });

  describe('accountDiscovery', () => {
    it('discover a bitcoin testnet account', async () => {
      const response = {
        data: {
          addrStr: '2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf',
          balance: 0.36476333,
          balanceSat: 36476333,
          totalReceived: 2.63638985,
          totalReceivedSat: 263638985,
          totalSent: 2.27162652,
          totalSentSat: 227162652,
          unconfirmedBalance: 0,
          unconfirmedBalanceSat: 0,
          unconfirmedTxApperances: 0,
          txApperances: 27,
        },
      };
      const emptyResponse = {
        data: {
          addrStr: '2N6JMWTb79SMh94j82jfMKDSL3wXWkb1MFM',
          balance: 0,
          balanceSat: 0,
          totalReceived: 0,
          totalReceivedSat: 0,
          totalSent: 0,
          totalSentSat: 0,
          unconfirmedBalance: 0,
          unconfirmedBalanceSat: 0,
          unconfirmedTxApperances: 0,
          txApperances: 0,
        },
      };
      mockAxios.get.mockResolvedValue(emptyResponse);
      const wallet: any = btc.generateHDWallet(entropy, network);
      const discovery = await btc.accountDiscovery(wallet, network, true);
      console.log('discovery :', discovery);
    });
  });
  // it('can confirm a bitcoin testnet address is not valid', () => {
  //   const valid = btc.validateAddress('2MyFPraHtEy2uKttPeku1okVeyJGTYvkf', network);
  //   expect(valid).toBe(false);
  // });

  // });


  // it('can create a 3 of 4 multisig address', () => {
  //   const address: any = btc.generateSegWit3of4MultiSigAddress(
  //     '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
  //     '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
  //     '023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59',
  //     '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9', 'BITCOIN',
  //   );
  //   assert.strictEqual(address.address, 'bc1q75f6dv4q8ug7zhujrsp5t0hzf33lllnr3fe7e2pra3v24mzl8rrqtp3qul');
  // });

  // it('can create a P2SH multisig address', () => {
  //   const address: any = btc.gernerateP2SHMultiSig(
  //     ['026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
  //       '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9'], 'BITCOIN',
  //   );
  //   assert.strictEqual(address.address, '3P4mrxQfmExfhxqjLnR2Ah4WES5EB1KBrN');
  // });

  // it('can detect an invalid wallet type when creating a keypair', () => {
  //   const wallet: any = btc.generateHDWallet(entropy, 'ETHEREUM');
  //   const badFn = () => btc.generateKeyPair(wallet, 0);
  //   expect(badFn).toThrow('Invalid wallet type');
  // });

  // it('can import a keypair from a WIF', () => {
  //   const keypair = btc.importWIF('cNJiShRC1rQqQ8MZDtvGWqHJq2sDgErcnq897jq1YMnpCm8JRFXr', network);
  //   assert.strictEqual(keypair.address, '2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf');
  // });

  // it('can import a dash testnet keypair from a WIF', () => {
  //   const keypair = btc.importWIF('cSsfhMdx4kqS2KjkipGr9dNp6Ae1ysjMhZg66in9SVHnYQMCU9jf', 'DASH_TESTNET');
  //   assert.strictEqual(keypair.address, 'yWxRFULbGzvNuFafp1jUFNenXbiGrdoNWr');
  // });

  // it('can generate a segwit address', () => {
  //   const wallet: any = btc.generateHDWallet(entropy, network);
  //   const keypair: any = btc.generateKeyPair(wallet, 0);
  //   const segwitAddress: any = btc.generateSegWitAddress(keypair);
  //   assert.strictEqual(segwitAddress, 'tb1qgmfs2qjff3726j9sy76hpa2mnlnsvv4nnd7zxt');
  // });

  // it('can validate a bicoin testnet address', () => {
  //   const ad = btc.validateAddress('2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf', 'BITCOIN_TESTNET');
  //   expect(ad).toBe(true);
  // });

  // it('can validate a litecoin testnet address', () => {
  //   const ad = btc.validateAddress('QSc9ybA8G55zU5eSGrw32hFBe3R88gkLWc', 'LITECOIN_TESTNET');
  //   expect(ad).toBe(true);
  // });

  // it('can validate an incorrect testnet address', () => {
  //   const ad = btc.validateAddress('2MyFPraHtEy2uKttPeku1wzokTeyJGTYvkf', 'BITCOIN_TESTNET');
  //   expect(ad).toBe(false);
  // });

  // it('can get the transaction history of a wallet', async () => {
  //   const tData: any = await btc.getTransactionHistory(
  //     testAddresses, 'BITCOIN_TESTNET', 0, 50,
  //   );
  //   expect(tData.txs.length).toBe(32);
  // });

  // it(Throws an error when passed an invalid address in getTransactionHistory', async () => {
  //   const badFn = () => btc.getTransactionHistory(
  //     ['bad address'], 'BITCOIN_TESTNET', 0, 50,
  //   );
  //   expect(badFn).toThrow('Invalid address used');
  // });

  // it(Throws an error when passed an invalid network in getTransactionHistory', async () => {
  //   const badFn = () => btc.getTransactionHistory(
  //     testAddresses, 'ETHEREUM', 0, 50,
  //   );
  //   expect(badFn).toThrow('Invalid network type');
  // });

  // // it('can get the balance of a wallet', async () => {
  // //   const tData: any = await btc.getBalance(
  // //     testAddresses, 'BITCOIN_TESTNET',
  // //   );
  // //   expect(tData).toBe(0.23612026);
  // // });

  // // it('can get the transaction history of a wallet', async () => {
  // //   const wallet: any = btc.generateHDWallet(entropy2, network);
  // //   const addresses: any = ['2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf',
  // //     '2N6JMWTb79SMh94j82jfMKDSL3wXWkb1MFM', '2NCJs2EA4gwiGJQYpKXoPiebR2vQsBNzdaA',
  // //   ];
  // //   const tData: any = await btc.getTransactionHistory(
  // //     addresses, 'BITCOIN_TESTNET', 0, 50,
  // //   );
  // //   console.log(tData);
  // // });


  // it('can get the unspent transactions of a wallet', async () => {
  //   const addresses = [
  //     '2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf', '2N6JMWTb79SMh94j82jfMKDSL3wXWkb1MFM'];
  //   const tData: any = await btc.getUTXOs(addresses, 'BITCOIN_TESTNET');
  //   expect(tData.length).toBe(11);
  // });

  // it('can get the unspent transactions of a litecoin testnet wallet', async () => {
  //   const addresses = [
  //     'QSc9ybA8G55zU5eSGrw32hFBe3R88gkLWc'];
  //   const tData: any = await btc.getUTXOs(addresses, 'BITCOIN_TESTNET');
  //   expect(tData.length).toBe(1);
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
  //   const change1: any = btc.generateKeyPair(wallet, 0, true);
  //   const addresses = [
  //     'QSc9ybA8G55zU5eSGrw32hFBe3R88gkLWc', change1.address];
  //   const utxos: any = await btc.getUTXOs(addresses, 'LITECOIN_TESTNET');


  //   const accounts = [{
  //     address: 'QSc9ybA8G55zU5eSGrw32hFBe3R88gkLWc',
  //     index: 0,
  //     change: false,
  //   },
  //   {
  //     address: change1.address,
  //     index: 0,
  //     change: true,
  //   }];


  //   const change2: any = btc.generateKeyPair(wallet, 1, true);

  //   const change = [
  //     'QSc9ybA8G55zU5eSGrw32hFBe3R88gkLWc'];

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
  //   const wallet = btc.generateHDWallet(testWallet1, 'LITECOIN_TESTNET');

  //   const externalAccountDiscovery: any = await btc.accountDiscovery(
  //     wallet, 'LITECOIN_TESTNET',
  //   );
  //   const internalAccountDiscovery: any = await btc.accountDiscovery(
  //     wallet,
  //     'LITECOIN_TESTNET', true,
  //   );
  //   console.log(externalAccountDiscovery);
  //   console.log(internalAccountDiscovery);

  //   // expect(externalAccountDiscovery.used.length).toBe(1);
  // });

  // it('can create a raw transaction', async () => {
  //   const wallet = btc.generateHDWallet(testWallet1, 'REGTEST');
  //   const receiverWallet = btc.generateHDWallet(entropy2, 'REGTEST');

  //   const addresses = [
  //     'n4eiacZAaphoe3vbyhPSJEKvnuutXM2dF2', 'mjdmyU6zzBThpC9z5K7eh53aURUyRM2yY5', 'my5i7nyM4n33og1KCX5eor7pZYvt5JTXEQ', 'mz5ojTWiLoTVwLdUJ5s7v86mwCtYhYYUmf', 'n1zHNzNQuXdwLXhnsrsepcHVDyRmjRtvBC'];
  //   const utxos: any = await btc.getUTXOs(addresses, 'REGTEST');


  //   const accounts = [{
  //     address: 'n4eiacZAaphoe3vbyhPSJEKvnuutXM2dF2',
  //     change: false,
  //     index: 1,
  //   },
  //   {
  //     address: 'mjdmyU6zzBThpC9z5K7eh53aURUyRM2yY5',
  //     change: false,
  //     index: 0,
  //   },
  //   {
  //     address: 'my5i7nyM4n33og1KCX5eor7pZYvt5JTXEQ',
  //     change: true,
  //     index: 0,
  //   },
  //   {
  //     address: 'mz5ojTWiLoTVwLdUJ5s7v86mwCtYhYYUmf',
  //     change: true,
  //     index: 1,
  //   },
  //   {
  //     address: 'n1zHNzNQuXdwLXhnsrsepcHVDyRmjRtvBC',
  //     change: true,
  //     index: 2,
  //   }];

  //   const change1: any = btc.generateKeyPair(wallet, 0);
  //   // const change2: any = btc.generateKeyPair(wallet, 1, true);

  //   const change = [
  //     change1.address];


  //   const tData: any = await btc.createRawTx(
  //     accounts, change, utxos, wallet, '2N9bSDMEiD68PXWcprfZKGdoNeKCNZ45bCN', 0, 30, true,
  //   );
  //   console.log(tData);


  //   // const pushTx = await btc.broadcastTx(tData.hexTx, 'REGTEST');
  //   // console.log('txid :', pushTx);
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

  // it('can get the latest price feed', async () => {
  //   const prices = await btc.getPriceFeed(['BTC', 'ETH', 'LTC', 'DASH', 'DOGE'], ['GBP', 'EUR', 'USD']);
  //   console.log('prices :', prices);
  // });

  // it('can get the historical price data', async () => {
  //   const prices = await btc.getHistoricalData('BTC', 'GBP', 'day');
  //   const times = prices.map((x: any) => ({
  //     t: x.time * 1000,
  //     y: x.close,
  //   }));
  //   console.log('times :', prices);
  // });
});


