/* eslint-disable import/no-unresolved */
import 'jest';
import axios from 'axios';
import { CryptoWallet } from '../../src/SDKFactory';

jest.mock('axios');
const mockAxios: any = axios;
const btc: any = CryptoWallet.createSDK('Bitcoin');
const eth: any = CryptoWallet.createSDK('Ethereum');
const entropy = 'nut mixture license bean page mimic iron spice rail uncover then warfare';
const network = 'BITCOIN_TESTNET';

describe('bitcoinSDK (wallet)', () => {
  describe('generateSegWitAddress', () => {
    it('can generate a BTC testnet segwit address', () => {
      const wallet: any = btc.generateHDWallet(entropy, network);
      const keypair: any = btc.generateKeyPair(wallet, 0);
      const address = btc.generateSegWitAddress(keypair);
      expect(address).toBe('tb1qgmfs2qjff3726j9sy76hpa2mnlnsvv4nnd7zxt');
    });

    it('can detect if an invalid keypair is used', () => {
      const wallet: any = eth.generateHDWallet(entropy, 'ETHEREUM');
      const keypair: any = eth.generateKeyPair(wallet, 0);
      expect(() => btc.generateSegWitAddress(keypair)).toThrow('Invalid keypair type');
    });
  });
  describe('generateSegWitP2SH', () => {
    it('can generate a BTC testnet segwit address', () => {
      const wallet: any = btc.generateHDWallet(entropy, network);
      const keypair: any = btc.generateKeyPair(wallet, 0);
      const address = btc.generateSegWitP2SH(keypair);
      expect(address).toBe('2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf');
    });
    it('can detect if an invalid keypair is used', () => {
      const wallet: any = eth.generateHDWallet(entropy, 'ETHEREUM');
      const keypair: any = eth.generateKeyPair(wallet, 0);
      expect(() => btc.generateSegWitP2SH(keypair)).toThrow('Invalid keypair type');
    });
  });

  describe('generateSegWit3of4MultiSigAddress', () => {
    it('can generate a BTC segwit 3 of 4 multisig address', () => {
      const address = btc.generateSegWit3of4MultiSigAddress(
        '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
        '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
        '023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59',
        '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
        'BITCOIN',
      );
      expect(address).toBe('bc1q75f6dv4q8ug7zhujrsp5t0hzf33lllnr3fe7e2pra3v24mzl8rrqtp3qul');
    });

    it('can detect if an invalid network is used', () => {
      expect(() => btc.generateSegWit3of4MultiSigAddress(
        '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
        '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
        '023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59',
        '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
        'ETHEREUM',
      )).toThrow('Invalid network');
    });

    it('can detect if an invalid public key is used', () => {
      expect(() => btc.generateSegWit3of4MultiSigAddress(
        '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e0',
        '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
        '023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59',
        '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
        'BITCOIN',
      )).toThrow('Invalid public key used');
    });
  });

  describe('generateP2SHMultiSig', () => {
    const keys = [
      '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
      '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
      '023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59',
      '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
    ];

    it('can generate a BTC testnet P2SH multisig', () => {
      const address = btc.generateP2SHMultiSig(keys, 'BITCOIN');
      expect(address).toBe('3DAeAnDta65gFaTB3QLNb3HA5kC3qSmBcm');
    });

    it('can detect if an invalid network is used', () => {
      expect(() => btc.generateP2SHMultiSig(keys, 'ETHEREUM')).toThrow('Invalid network');
    });

    it('can detect if an invalid public key is used', () => {
      expect(() => btc.generateP2SHMultiSig(
        ['026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e0',
          '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
          '023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59',
          '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9'],
        'BITCOIN',
      )).toThrow('Invalid public key used');
    });
  });

  describe('getUTXOs', () => {
    it('can retrieve the UTXOs of a btc testnet address', async () => {
      mockAxios.get.mockResolvedValue({
        data: [{
          address: '2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf',
          txid: '48d2bc7293fe1b1b3c74b1276861c3ab1a63a01fbf87789c192f3491422e9dbf',
          vout: 82,
          scriptPubKey: 'a91441d8fdc7c1218b669e29928a209cd2d4df70ca9687',
          amount: 0.17433129,
          satoshis: 17433129,
          height: 1448809,
          confirmations: 29673,
        }],
      });
      const utxos = await btc.getUTXOs(['2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf'], network);
      expect(utxos[0].value).toBe(17433129);
    });

    it('can retrieve the UTXOs of a btc testnet address', async () => {
      mockAxios.get.mockResolvedValue({
        data: [],
      });
      const utxos = await btc.getUTXOs(['2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf'], network);
      expect(utxos).toEqual([]);
    });

    it('can detect if an invalid network is used', () => {
      expect(() => btc.getUTXOs(['2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf'], 'ETHEREUM')).toThrow('Invalid network');
    });

    it('can detect if an invalid address is used', () => {
      expect(() => btc.getUTXOs(['2MyFPraHtEy2uKttPeku1wzokVeyJGTYvk'], network)).toThrow('Invalid address used');
    });
    it('can detect an API error', async () => {
      mockAxios.get.mockResolvedValue(() => { throw new Error('some error'); });
      const utxos = btc.getUTXOs(['2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf'], network)
        .catch((e: Error) => expect(e.message).toBe('Failed to fetch UTXOs'));
      return utxos;
    });
  });

  describe('createTxToMany', () => {
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
    it('can create a raw tx with 2 recepients ', async () => {
      const tx = await btc.createTxToMany(
        accounts,
        ['2NCJs2EA4gwiGJQYpKXoPiebR2vQsBNzdaA'],
        utxo,
        wallet,
        ['2NB9kPS83wUZHdFu222vJNXSJXBvVoVgvqc',
          '2Mt7HbkByM5SRjVFBnxBAyBsUwJWWDQrQcH'],
        [0.05, 0.05],
        36,
      );
      console.log(tx);
    });

    it('can create a raw tx with 2 recepients and 2 change addresses ', async () => {
      const changeAccount = [{
        address: '2MyFPraHtEy2uKttPeku1wzokVeyJGTYvkf',
        index: 0,
        change: true,
      }];
      const tx = await btc.createTxToMany(
        changeAccount,
        ['2NCJs2EA4gwiGJQYpKXoPiebR2vQsBNzdaA',
          '2NDbQDbR89XMTbTDSzfWUS93DXbywDqYCtH'],
        utxo,
        wallet,
        ['2NB9kPS83wUZHdFu222vJNXSJXBvVoVgvqc',
          '2Mt7HbkByM5SRjVFBnxBAyBsUwJWWDQrQcH'],
        [0.05, 0.05],
        36,
      );
      console.log(tx);
    });

    it('can create a Dash testnet raw transaction with 2 recepients', async () => {
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

      const rawTx = await btc.createTxToMany(
        dashAccounts,
        ['yifJaS4dzhySqAWmFfm3E2gaysZRQmaJix'],
        dashUtxo,
        dashWallet,
        ['yc1v3o1TkA5TUKntjFriDcoRBKgJ4hutZM',
          'yLhoHGyVegBkDJWfzJZNuZtse1g7w2mxTU'],
        [5, 5],
        36,
      );
      console.log(rawTx);
    });

    it('can detect an invalid wallet object ', async () => {
      expect(() => btc.createTxToMany(
        accounts,
        ['2NCJs2EA4gwiGJQYpKXoPiebR2vQsBNzdaA'],
        utxo,
        'wallet',
        ['2NB9kPS83wUZHdFu222vJNXSJXBvVoVgvqc',
          '2Mt7HbkByM5SRjVFBnxBAyBsUwJWWDQrQcH'],
        [0.05, 0.05],
        36,
      )).toThrow('Invalid wallet type');
    });

    it('can detect when there is no balance when creating a transaction', async () => {
      const emptyUtxo:any = [];
      expect(btc.createTxToMany(
        accounts,
        ['2NCJs2EA4gwiGJQYpKXoPiebR2vQsBNzdaA'],
        emptyUtxo,
        wallet,
        ['2NB9kPS83wUZHdFu222vJNXSJXBvVoVgvqc',
          '2Mt7HbkByM5SRjVFBnxBAyBsUwJWWDQrQcH'],
        [0.1, 0.1],
        36,
      )).rejects.toMatch('You don\'t have enough balance to cover transaction');
    });

    it('can detect when there is not enough balance to cover the transaction', async () => {
      expect(btc.createTxToMany(
        accounts,
        ['2NCJs2EA4gwiGJQYpKXoPiebR2vQsBNzdaA'],
        utxo,
        wallet,
        ['2NB9kPS83wUZHdFu222vJNXSJXBvVoVgvqc',
          '2Mt7HbkByM5SRjVFBnxBAyBsUwJWWDQrQcH'],
        [5, 5],
        36,
      )).rejects.toMatch('You don\'t have enough Satoshis to cover the miner fee.');
    });
  });
  describe('generateSegWit3of4MultiSigAddress', () => {
    it('can generate a BTC testnet segwit 3 of 4 multisig address', () => {
      const address = btc.generateSegWit3of4MultiSigAddress(
        '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
        '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
        '023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59',
        '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
        'BITCOIN',
      );
      expect(address).toBe('bc1q75f6dv4q8ug7zhujrsp5t0hzf33lllnr3fe7e2pra3v24mzl8rrqtp3qul');
    });

    it('can detect if an invalid network is used', () => {
      expect(() => btc.generateSegWit3of4MultiSigAddress(
        '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
        '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
        '023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59',
        '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
        'ETHEREUM',
      )).toThrow('Invalid network');
    });

    it('can detect if an invalid public key is used', () => {
      expect(() => btc.generateSegWit3of4MultiSigAddress(
        '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e0',
        '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
        '023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59',
        '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
        'BITCOIN',
      )).toThrow('Invalid public key used');
    });
  });
});


