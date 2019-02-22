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
      expect(() => btc.generateSegWitAddress(keypair)).toThrow('Invalid keypair type');
    });
  });
});


