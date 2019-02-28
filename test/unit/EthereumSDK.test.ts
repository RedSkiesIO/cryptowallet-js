/* eslint-disable import/no-unresolved */
import 'jest';
import axios from 'axios';
import * as web3 from 'web3';
import { CryptoWallet } from '../../src/SDKFactory';
import mockEthTransactionHistory from '../datasets/mockEthTransactionHistory';
// mock axios
jest.mock('axios');
const mockAxios: any = axios;
// mock web3
jest.genMockFromModule('web3');
jest.mock('web3');
const jestWeb3: any = web3;
const mockWeb3 = {
  utils: {
    isAddress: jest.fn(),
    toHex: jest.fn(() => 0),
    toWei: jest.fn(() => '0'),
    fromWei: jest.fn(() => '0'),
    sha3: jest.fn(() => '0x04d258dbc9374f373e60c1a24d9603fe917aec8ed67a5263bb84b9a1d5958570'),
  },
  eth: {
    getTransactionCount: jest.fn(),
    sendSignedTransaction: jest.fn(),
  },
};
jestWeb3.mockImplementation(() => mockWeb3);

const eth: any = CryptoWallet.createSDK('Ethereum');
const entropy = 'nut mixture license bean page mimic iron spice rail uncover then warfare';
const network = 'ETHEREUM_ROPSTEN';

describe('ethereumSDK (wallet)', () => {
  describe('generateKeyPair', () => {
    it('can generate an ethereum testnet keypair', () => {
      const wallet = eth.generateHDWallet(entropy, network);
      const keypair = eth.generateKeyPair(wallet, 0);
      expect(keypair.address).toBe('0x8f97Bb9335747E4fCdDA8680F66ed96DcBe27F49');
    });

    it('can detect an invalid wallet', () => {
      const badFn = () => eth.generateKeyPair('wallet', 0);
      expect(badFn).toThrow('Invalid wallet type');
    });
  });
});

