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
});


