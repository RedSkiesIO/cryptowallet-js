/**
* Copyright (c) 2019 https://atlascity.io
*
* This file is part of CryptoWallet-js <https://github.com/atlascity/cryptowallet-js>
*
* CryptoWallet-js is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 2 of the License, or
* (at your option) any later version.
*
* CryptoWallet-js is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with CryptoWallet-js. If not, see <https://www.gnu.org/licenses/>.
*/
import 'jest';
import { KeyPair } from 'src/SDKS/GenericSDK.d';
import axios from 'axios';
import CryptoWallet from '../../src/SDKFactory';
import mockTransactionHistory from '../datasets/mockTransactionHistory';

jest.mock('axios');
const mockAxios: any = axios;
const btc: any = CryptoWallet.createSDK('default');
const entropy = 'nut mixture license bean page mimic iron spice rail uncover then warfare';
const invalidEntropy = 'nut mixture license bean page mimic iron spice rail uncover then';
const regtest = 'myth like bonus scare over problem client lizard pioneer submit female collect';
const network = 'BITCOIN_TESTNET';
const derPath = 'm/49\'/1\'/0\'/0/0';

describe('bitcoinSDK (wallet)', () => {
  describe('generateHDWallet', () => {
    it('can generate a BTC testnet HD wallet', () => {
      const wallet: any = btc.generateHDWallet(entropy, 'BITCOIN_TESTNET');
      expect(wallet.ext.xpriv).toBe('xprvA1zR34Tm9KnyfTxTd9n7m7Q1gMauEKPNzdRL7nfF3cGYiwLYd9xmPJBdRGfL6tu4U46oQf4FhjG2ysih1e5Wfa7ia6W8ZhrLUEcKAjUqLNs');
      expect(wallet.ext.xpub).toBe('xpub6EymSZzeyhMGsx2vjBK88FLkEPRPdn7EMrLvvB4rbwoXbjfhAhH1w6W7GY7MY2nMfp4ebihHWYh5wg2U4wQX3c9JUTndGAa2JjjrZY1f3dc');
      expect(wallet.bip).toBe(49);
      expect(wallet.type).toBe(1);
    });

    it('can generate a regtest HD wallet', () => {
      const wallet: any = btc.generateHDWallet(entropy, 'REGTEST');
      expect(wallet.ext.xpriv).toBe('xprv9uZZn2GG7khoyKSKnxBnwc1G9YcrSAtVZ7ohwxwDWUJDfWNHqZE4vUWjbbrXmhCzTERyzWzwuobfkwM1ZiG9DQBXwjEAA3wraqcU1do4Rir');
      expect(wallet.ext.xpub).toBe('xpub68YvBXo9x8G7BoWntyioJjwzhaTLqdcLvLjJkMLq4oqCYJhSP6YKUGqDSsu1aQSejM9xxApK67fzupboqQ8TkXeAb81ySQj2yC4f1MfrTg8');
      expect(wallet.bip).toBe(0);
      expect(wallet.type).toBe(0);
    });

    it('can generate a Litecoin HD wallet', () => {
      const wallet: any = btc.generateHDWallet(entropy, 'LITECOIN');
      expect(wallet.ext.xpriv).toBe('xprv9zZDbfbjnMv81DYDd79G8BGHa6y9aEbUwYoXjGVQdW4MxJw4XpE5CGmRcbXcFMW3AmZh3GZr8Lj6fQUPs46s5rgj7BgY21XsNV4RKvewxAq');
      expect(wallet.ext.xpub).toBe('xpub6DYa1B8dcjURDhcgj8gGVKD288odyhKLJmj8Xeu2BqbLq7GD5MYKk55uTsw1T9n2QvQRrgbW4n465CZUQsVekBGKQQ5mpphqy97Vhe9j8Pg');
      expect(wallet.bip).toBe(49);
      expect(wallet.type).toBe(2);
    });

    it('can generate a Dash HD wallet', () => {
      const wallet: any = btc.generateHDWallet(entropy, 'DASH');
      expect(wallet.ext.xpriv).toBe('xprvA1WARJ2YwFfriS6eQHWBWecQYd6VPt5c7safPbLeiNsHct9pSTeZZe3oV3CkVK6KHrxfp44w3phNcfJDxvvQSd5TJcotRWkcRkhetQQGz7f');
      expect(wallet.ext.xpub).toBe('xpub6EVWpoZSmdE9vvB7WK3BsnZ96evyoLoTV6WGBykGGiQGVgUxyzxp7SNHLM8V79Y9jvF91TRnUwyFiDmUotWWopsgGdWURkT6sscFHaouoQ1');
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

  describe('broadcastTx', () => {
    it('can broadcast a bitcoin tx', async () => {
      mockAxios.post.mockResolvedValue(
        { data: { data: { txid: '1d2f020ee297d424c7b527151d204d1513177229c785e1e9f3684a60c1b7c8cc' } } },
      );
      const txHash = await btc.broadcastTx('txHex', 'BITCOIN');
      expect(txHash).toBe('1d2f020ee297d424c7b527151d204d1513177229c785e1e9f3684a60c1b7c8cc');
    });

    it('can broadcast a dash tx', async () => {
      mockAxios.post.mockResolvedValue(
        { data: { txid: '4e6cdc18fc0dcaa2973de2a3d317f2d84484a3ba11ac42c319481957bd992bcd' } },
      );
      const txHash = await btc.broadcastTx('txHex', 'DASH');
      expect(txHash).toBe('4e6cdc18fc0dcaa2973de2a3d317f2d84484a3ba11ac42c319481957bd992bcd');
    });

    it('can detect when a bitcoin testnet transaction fails', async () => {
      mockAxios.post.mockResolvedValue(new Error('Transaction failed'));
      const txHash = await btc.broadcastTx('txHex', network)
        .catch((e: Error) => expect(e.message).toMatch('Transaction failed'));
      return txHash;
    });

    it('can detect when a dash transaction fails', async () => {
      mockAxios.post.mockResolvedValue(new Error('Transaction failed'));
      const txHash = await btc.broadcastTx('txHex', 'DASH')
        .catch((e: Error) => expect(e.message).toMatch('Transaction failed'));
      return txHash;
    });

    it('can detect when an invalid network is used', async () => {
      mockAxios.post.mockResolvedValue(new Error('Transaction failed'));
      expect(() => btc.broadcastTx('txHex', 'Ethereum')).toThrow('Invalid network type');
    });
  });

  describe('getTransactionFee', () => {
    it('can get the transacion fee for a bitcoin transaction', async () => {
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

    it('can detect an API error', async () => {
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
      )).rejects.toEqual(new Error('You don\'t have enough balance to cover transaction'));
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
      )).rejects.toEqual(new Error('You don\'t have enough Satoshis to cover the miner fee.'));
    });
  });

  describe('verifyTxSignature', () => {
    const transaction = {
      txHex: '010000000321c5f7e7bc98b3feda84aad36a5c99a02bcb8823a2f3eccbcd5da209698b5c20000000006b48304502210099e021772830207cf7c55b69948d3b16b4dcbf1f55a9cd80ebf8221a169735f9022064d33f11d62cd28240b3862afc0b901adc9f231c7124dd19bdb30367b61964c50121032b4c06c06c3ec0b7fa29519dfa5aae193ee2cc35ca127f29f14ec605d62fb63dffffffff8a75ce85441ddb3f342708ee33cc8ed418b07d9ba9e0e7c4e1cccfe9f52d8a88000000006946304302207916c23dae212c95a920423902fa44e939fb3d542f4478a7b46e9cde53705800021f0d74e9504146e404c1b8f9cba4dff2d4782e3075491c9ed07ce4a7d1c4461a01210216c92abe433106491bdeb4a261226f20f5a4ac86220cc6e37655aac6bf3c1f2affffffffdfef93f69fe32e944fad79fa8f882b3a155d80383252348caba1a77a5abbf7ef000000006b483045022100faa6e9ca289b46c64764a624c59ac30d9abcf1d4a04c4de9089e67cbe0d300a502206930afa683f6807502de5c2431bf9a1fd333c8a2910a76304df0f3d23d83443f0121039e05da8b8ea4f9868ecebb25998c7701542986233f4401799551fbecf316b18fffffffff01ff4b0000000000001976a9146c86476d1d85cd60116cd122a274e6a570a5a35c88acc96d0700',
      pubKeys: [
        '032b4c06c06c3ec0b7fa29519dfa5aae193ee2cc35ca127f29f14ec605d62fb63d',
        '0216c92abe433106491bdeb4a261226f20f5a4ac86220cc6e37655aac6bf3c1f2a',
        '039e05da8b8ea4f9868ecebb25998c7701542986233f4401799551fbecf316b18f',
      ],
    };
    it('verify a bitcoin transaction signature', () => {
      const valid = btc.verifyTxSignature(transaction, 'BITCOIN');
      expect(valid).toBe(true);
    });

    it('can detect an invalid network', () => {
      expect(() => btc.verifyTxSignature(transaction, 'bitocin')).toThrow('Invalid network type');
    });
  });

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
      const usedAddress = {
        data: {
          addrStr: '2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf',
          balance: 0,
          balanceSat: 0,
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
      mockAxios.get.mockImplementationOnce(() => response);
      mockAxios.get.mockImplementationOnce(() => usedAddress);
      mockAxios.get.mockResolvedValue(emptyResponse);
      const wallet: any = btc.generateHDWallet(entropy, network);
      const discovery = await btc.accountDiscovery(wallet, true);
      expect(discovery.nextAddress).toBe(2);
    });

    it('can detect an invalid wallet type', async () => {
      expect(() => btc.accountDiscovery('wallet')).toThrow('Invalid wallet type');
    });

    it('can detect an api error', async () => {
      mockAxios.get.mockResolvedValue(new Error('error'));
      const wallet: any = btc.generateHDWallet(entropy, network);
      const discovery = btc.accountDiscovery(wallet, true)
        .catch((e: Error) => expect(e.message).toMatch('API ERROR'));
      return discovery;
    });
  });

  describe('getTransactionHistory', () => {
    it('can get the transaction histoy of bitcoin testnet address', async () => {
      mockAxios.get.mockResolvedValue({ data: mockTransactionHistory });
      const addresses = ['2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf'];
      const history = await btc.getTransactionHistory(addresses, network, 0, 50);
      expect(history.totalTransactions).toBe(27);
    });

    it('can get the transaction histoy of an unused bitcoin testnet address', async () => {
      mockAxios.get.mockResolvedValue({ data: { totalItems: 0 } });
      const addresses = ['2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf'];
      const history = await btc.getTransactionHistory(addresses, network, 0, 50);
      expect(history).toBeUndefined();
    });

    it('can check if more transaction history is available', async () => {
      mockAxios.get.mockResolvedValue({ data: mockTransactionHistory });
      const addresses = ['2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf'];
      const history = await btc.getTransactionHistory(addresses, network, 0, 20);
      expect(history.more).toBe(true);
    });

    it('can detect if an invalid address is used', async () => {
      mockAxios.get.mockResolvedValue({ data: mockTransactionHistory });
      const addresses = ['2MyFPraHtEy2uKttPeku1wzokVeyJGTYvk'];
      expect(() => btc.getTransactionHistory(addresses, network, 0, 20)).toThrow('Invalid address used');
    });

    it('can detect if an invalid network is used', async () => {
      mockAxios.get.mockResolvedValue({ data: mockTransactionHistory });
      const addresses = ['2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf'];
      expect(() => btc.getTransactionHistory(addresses, 'ETHEREUM', 0, 20)).toThrow('ETHEREUM is an invalid network');
    });

    it('can catch an API error', async () => {
      mockAxios.get.mockResolvedValue(new Error('some error'));
      const addresses = ['2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf'];
      const history = await btc.getTransactionHistory(addresses, network, 0, 20)
        .catch((e: Error) => expect(e.message).toMatch('API failed to get transaction history'));
    });
  });

  describe('getBalance', () => {
    it('can get the balance of a bitcoin testnet address', async () => {
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
      mockAxios.get.mockResolvedValue({ data: utxo });
      const balance = await btc.getBalance(['2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf'], network);
      expect(balance).toBe(0.17433129);
    });

    it('can get the balance of an empty bitcoin testnet address', async () => {
      mockAxios.get.mockResolvedValue({ data: [] });
      const balance = await btc.getBalance(['2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf'], network);
      expect(balance).toBe(0);
    });

    it('can detect if an invalid address is used', async () => {
      const addresses = ['2MyFPraHtEy2uKttPeku1wzokVeyJGTYvk'];
      expect(() => btc.getBalance(addresses, network)).toThrow('Invalid address used');
    });

    it('can detect if an invalid network is used', async () => {
      mockAxios.get.mockResolvedValue({ data: mockTransactionHistory });
      const addresses = ['2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf'];
      expect(() => btc.getBalance(addresses, 'ETHEREUM')).toThrow('ETHEREUM is an invalid network');
    });

    it('can catch an API error', async () => {
      mockAxios.get.mockResolvedValue(new Error('some error'));
      const addresses = ['2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf'];
      const balance = await btc.getBalance(addresses, network)
        .catch((e: Error) => expect(e.message).toMatch('API failed to return a balance'));
      return balance;
    });
  });
});


