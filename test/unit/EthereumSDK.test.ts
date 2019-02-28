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

  describe('generateAddress', () => {
    it('can generate an ethereum testnet address', () => {
      const wallet = eth.generateHDWallet(entropy, network);
      const account = eth.generateAddress(wallet, 0);
      expect(account.address).toBe('0x8f97Bb9335747E4fCdDA8680F66ed96DcBe27F49');
    });

    it('can detect an invalid wallet', () => {
      const badFn = () => eth.generateAddress('wallet', 0);
      expect(badFn).toThrow('Invalid wallet type');
    });

    it('can detect an invalid wallet', () => {
      const btc: any = CryptoWallet.createSDK('Bitcoin');
      const wallet = btc.generateHDWallet(entropy, 'BITCOIN');
      const badFn = () => eth.generateAddress('wallet', 0);
      expect(badFn).toThrow('Invalid wallet type');
    });
  });

  describe('validateAddress', () => {
    it('can generate an ethereum testnet address', () => {
      mockWeb3.utils.isAddress.mockImplementationOnce(() => true);
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
      mockWeb3.eth.getTransactionCount.mockResolvedValue(5);
      const wallet = eth.generateHDWallet(entropy, network);
      const keypair = eth.generateKeyPair(wallet, 0);
      const tx = await eth.createEthTx(
        keypair,
        '0x7f088B42570631aD37989E81a4a5Ce86fdAFe4e1',
        0.1,
        18174088324,
      );
      expect(tx.transaction.hash).toBe('0x04d258dbc9374f373e60c1a24d9603fe917aec8ed67a5263bb84b9a1d5958570');
    });
  });

  describe('broadcastTx', () => {
    it('can broadcast an ethereum testnet raw transaction', async () => {
      mockWeb3.eth.sendSignedTransaction.mockResolvedValue('12345');
      const tx = await eth.broadcastTx('42193c2610f6f7ff06becfef595b4810d8808bdfee1dba819f69686353093f73', network);
      expect(tx.hash).toBe('12345');
    });
    it('can detect an error in broadcasting', async () => {
      mockWeb3.eth.sendSignedTransaction.mockResolvedValue(new Error('Transaction failed'));
      const tx = await eth.broadcastTx('42193c2610f6f7ff06becfef595b4810d8808bdfee1dba819f69686353093f73', network)
        .catch((e: Error) => expect(e.message).rejects.toMatch('Transaction failed'));
      return tx;
    });
  });

  describe('verifyTxSignature', () => {
    it('can verify a transaction is valid', async () => {
      const rawTx = [
        '0x00',
        '0x09184e72a000',
        '0x2710',
        '0x0000000000000000000000000000000000000000',
        '0x00',
        '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
        '0x1c',
        '0x5e1d3a76fbf824220eafc8c79ad578ad2b67d01b0c2425eb1f1347e8f50882ab',
        '0x5bd428537f05f9830e93792f90ea6a3e2d1ee84952dd96edbae9f658f831ab13',
      ];
      const verify = await eth.verifyTxSignature(rawTx);
      expect(verify).toBe(true);
    });

    it('can verify a transaction is not valid', async () => {
      const rawTx: any = [];
      const verify = await eth.verifyTxSignature(rawTx);
      expect(verify).toBe(false);
    });
  });

  describe('getTransactionHistory', () => {
    it('can get the transaction history of an ethereum address', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockEthTransactionHistory });
      const history = await eth.getTransactionHistory(
        ['0x8f97Bb9335747E4fCdDA8680F66ed96DcBe27F49'],
        network,
        0,
      );
      expect(history.totalTransactions).toBe(9);
    });

    it('can get the transaction history of an empty address', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: {} });
      const history = await eth.getTransactionHistory(
        ['0x8f97Bb9335747E4fCdDA8680F66ed96DcBe27F49'],
        network,
        0,
      );
      expect(history.totalTransactions).toBe(0);
    });

    it('can get transaction history containing contract calls', async () => {
      mockAxios.get.mockResolvedValueOnce({
        data: {
          status: '1',
          message: 'OK',
          result: [{
            blockNumber: '4561979',
            timeStamp: '1543942602',
            hash: '0x831e42d397be360458141a41ddcc3783e433fa987975a623d0da203eb8fbba5f',
            nonce: '810538',
            blockHash: '0xdde02a8a33b22af0546a521755b028f1bde6c12774ec971a83f10f688a6381d9',
            transactionIndex: '67',
            from: '0x687422eea2cb73b5d3e242ba5456b782919afc85',
            value: '1000000000000000000',
            gas: '314150',
            gasPrice: '1000000000',
            isError: '0',
            txreceipt_status: '1',
            input: '0x',
            contractAddress: '0x8f97bb9335747e4fcdda8680f66ed96dcbe27f49',
            cumulativeGasUsed: '4413304',
            gasUsed: '21000',
            confirmations: '542894',
          }],
        },
      });
      const history = await eth.getTransactionHistory(
        ['0x8f97Bb9335747E4fCdDA8680F66ed96DcBe27F49'],
        network,
        0,
      );
      expect(history.totalTransactions).toBe(1);
    });

    it('can detect an api error', async () => {
      mockAxios.get.mockRejectedValue(new Error('Failed to get transaction history'));
      const history = await eth.getTransactionHistory(
        ['0x8f97Bb9335747E4fCdDA8680F66ed96DcBe27F49'],
        network,
        0,
      ).catch((e: Error) => expect(e.message).toMatch('Failed to get transaction history'));
      return history;
    });
  });

  describe('getBalance', () => {
    it('can get the balance of an ethereum address', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: { result: 10000000000000000000 } });
      const balance = await eth.getBalance(
        ['0x8f97Bb9335747E4fCdDA8680F66ed96DcBe27F49'],
        network,
      );
      expect(balance).toBe(10);
    });

    it('can detect when the balance is dust', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: { result: 100000000000 } });
      const balance = await eth.getBalance(
        ['0x8f97Bb9335747E4fCdDA8680F66ed96DcBe27F49'],
        network,
      );
      expect(balance).toBe(0);
    });

    it('can detect an api error', async () => {
      mockAxios.get.mockRejectedValueOnce(new Error('Failed to get balance'));
      const balance = await eth.getBalance(
        ['0x8f97Bb9335747E4fCdDA8680F66ed96DcBe27F49'],
        network,
      ).catch((e: Error) => expect(e.message).toMatch('Failed to get balance'));
      return balance;
    });
  });

  describe('accountDiscovery', () => {
    it('can discover an ethereum wallet', async () => {
      const wallet = eth.generateHDWallet(entropy, network);
      const discovery = await eth.accountDiscovery(
        wallet,
      );
      expect(discovery).toHaveLength(10);
    });
  });
});

