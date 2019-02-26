/* eslint-disable import/no-unresolved */
import 'jest';
import axios from 'axios';
import { CryptoWallet } from '../../src/SDKFactory';

jest.mock('axios');
const mockAxios: any = axios;
const eth: any = CryptoWallet.createSDK('Ethereum');
const btc: any = CryptoWallet.createSDK('Bitcoin');
const entropy = 'nut mixture license bean page mimic iron spice rail uncover then warfare';
const network = 'ETHEREUM_ROPSTEN';

describe('ethereumSDK (wallet)', () => {
  describe('generateKeyPair', () => {
    it('can generate an ethereum testnet keypair', () => {
      const wallet = eth.generateHDWallet(entropy, network);
      const keypair = eth.generateKeyPair(wallet, 0);
      expect(keypair.address).toBe('0x8f97Bb9335747E4fCdDA8680F66ed96DcBe27F49');
    });
  });

  describe('generateAddress', () => {
    it('can generate an ethereum testnet address', () => {
      const wallet = eth.generateHDWallet(entropy, network);
      const account = eth.generateAddress(wallet, 0);
      expect(account.address).toBe('0x8f97Bb9335747E4fCdDA8680F66ed96DcBe27F49');
    });
  });

  describe('validateAddress', () => {
    it('can generate an ethereum testnet address', () => {
      const valid = eth.validateAddress('0x8f97Bb9335747E4fCdDA8680F66ed96DcBe27F49', network);
      expect(valid).toBe(true);
    });
  });

  describe('getTransactionFee', () => {
    it('can get the transacion fee for a ethereum transaction', async () => {
      const responseObj = {
        data: {
          name: 'ETH.main',
          height: 7270977,
          hash: '223f11d8ac5251bedcec70705eeabc16daa7f9020021557a6f99b60082401a10',
          time: '2019-02-26T17:06:11.897351734Z',
          latest_url: 'https://api.blockcypher.com/v1/eth/main/blocks/223f11d8ac5251bedcec70705eeabc16daa7f9020021557a6f99b60082401a10',
          previous_hash: '00262f9366afb574d070463ca0edd2b459150ba099f784c1bbfb8263c10f6a47',
          previous_url: 'https://api.blockcypher.com/v1/eth/main/blocks/00262f9366afb574d070463ca0edd2b459150ba099f784c1bbfb8263c10f6a47',
          peer_count: 184,
          unconfirmed_count: 35009,
          high_gas_price: 18174088324,
          medium_gas_price: 18174088324,
          low_gas_price: 5000000000,
          last_fork_height: 7270759,
          last_fork_hash: '41b2d45145d9e08133a8f6fbc6c4c7f79506d984daeae606104800f267ca5229',
        },
      };
      mockAxios.get.mockResolvedValue(responseObj);

      const fee = await eth.getTransactionFee(network);
      expect(fee).toEqual({
        high: 18174088324,
        medium: 18174088324,
        low: 5000000000,
        txHigh: 0.000381655854804,
        txMedium: 0.000381655854804,
        txLow: 0.000105,
      });
    });

    it('can detect an invalid network', async () => {
      expect(() => eth.getTransactionFee('bitocin')).toThrow('Invalid network');
    });

    it('can detect an API error', async () => {
      mockAxios.get.mockResolvedValue(() => { throw new Error('some error'); });
      return expect(eth.getTransactionFee(network)).rejects.toMatch('Cannot read property \'high_gas_price\' of undefined');
    });
  });

  describe('importWIF', () => {
    it('can import an ETH WIF', () => {
      const keypair = eth.importWIF('42193c2610f6f7ff06becfef595b4810d8808bdfee1dba819f69686353093f73', network);
      expect(keypair.address).toBe('0x8f97Bb9335747E4fCdDA8680F66ed96DcBe27F49');
    });
  });

  describe('createEthTx', () => {
    it('can create an ethereum testnet raw transaction', async () => {
      const wallet = eth.generateHDWallet(entropy, network);
      const keypair = eth.generateKeyPair(wallet, 0);
      const tx = await eth.createEthTx(
        keypair,
        '0x7f088B42570631aD37989E81a4a5Ce86fdAFe4e1',
        0.1,
        18174088324,
      );
      console.log('tx :', tx);
      expect(tx.transaction.hash).toBe('0x04d258dbc9374f373e60c1a24d9603fe917aec8ed67a5263bb84b9a1d5958570');
    });
  });
});
