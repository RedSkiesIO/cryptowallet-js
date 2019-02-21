/* eslint-disable import/no-unresolved */
import 'jest';
import { KeyPair } from 'src/SDKS/GenericSDK.d';
import axios from 'axios';
import { CryptoWallet } from '../../src/SDKFactory';

jest.mock('axios');
const mockAxios: any = axios;
const btc: any = CryptoWallet.createSDK('Bitcoin');
const entropy = 'nut mixture license bean page mimic iron spice rail uncover then warfare';
const invalidEntropy = 'nut mixture license bean page mimic iron spice rail uncover then';
const regtest = 'myth like bonus scare over problem client lizard pioneer submit female collect';
const network = 'BITCOIN_TESTNET';
const derPath = 'm/49\'/1\'/0\'/0/0';

describe('bitcoinSDK (wallet)', () => {
  describe('generateSegWitAddress', () => {
    it('can generate a BTC testnet segwit address', () => {
      const wallet: any = btc.generateHDWallet(entropy, 'BITCOIN_TESTNET');
      const keypair: any = btc.generateKeyPair(wallet, 0);
      const address = btc.generateSegWitAddress(keypair);
      expect(address).toBe('tb1qgmfs2qjff3726j9sy76hpa2mnlnsvv4nnd7zxt');
    });
  });
});


