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
import axios from 'axios';
import * as Web3 from 'web3';
import CryptoWallet from '../../src/SDKFactory';
import mockERC20TransactionHistory from '../datasets/mockERC20TransactionHistory';

const erc20: any = CryptoWallet.createSDK('ERC20');
const eth: any = CryptoWallet.createSDK('Ethereum');
const entropy = 'nut mixture license bean page mimic iron spice rail uncover then warfare';
const network = 'ETHEREUM_ROPSTEN';
const ethWallet = eth.generateHDWallet(entropy, network);
const ethKeypair = eth.generateKeyPair(ethWallet, 0);

// mock web3
jest.genMockFromModule('web3');
jest.mock('web3');
jest.mock('axios');

const mockAxios: any = axios;
const jestWeb3: any = Web3;

const mockWeb3 = {
  utils: {
    isAddress: jest.fn(() => true),
    toHex: jest.fn(() => 0),
    sha3: jest.fn(() => '0x04d258dbc9374f373e60c1a24d9603fe917aec8ed67a5263bb84b9a1d5958570'),
  },
  eth: {
    getTransactionCount: jest.fn(() => 5),
    sendSignedTransaction: jest.fn(),
    Contract: jest.fn(),
    getCode: jest.fn(),
  },
};
const mockCall = {
  call: jest.fn(),
};
const mockEncodeABI = {
  encodeABI: jest.fn(),
  estimateGas: jest.fn().mockImplementation((obj, callback) => {
    return callback(null, 25000);
  }),
};
const mockContract = {
  methods: {
    transfer: jest.fn(() => mockEncodeABI),
    approve: jest.fn(() => mockEncodeABI),
    transferFrom: jest.fn(() => mockEncodeABI),
    allowance: jest.fn(() => mockCall),
    balanceOf: jest.fn(() => mockCall),
    decimals: jest.fn(() => mockCall),
    name: jest.fn(() => mockCall),
    symbol: jest.fn(() => mockCall),
  },
};

jestWeb3.mockImplementation(() => mockWeb3);
mockWeb3.eth.Contract.mockImplementation(() => mockContract);

const wallet = erc20.generateERC20Wallet(
  ethKeypair,
  'Catalyst',
  'CAT',
  '0x26705403968a8c73656a2fed0f89245698718f3f',
  3,
);

describe('ERC20SDK', async () => {
  describe('generateERC20Wallet', () => {
    it('can create an ERC20 wallet', () => {
      expect(wallet.address).toBe('0x8f97Bb9335747E4fCdDA8680F66ed96DcBe27F49');
    });

    it('can detect an invalid address', async () => {
      mockWeb3.utils.isAddress = jest.fn(() => false);
      const invalidWallet = () => erc20.generateERC20Wallet(
        ethKeypair,
        'Catalyst',
        'CAT',
        '0x156AE1c2797494353C143070D01D5E4903bE2EB',
        3,
      );
      expect(invalidWallet).toThrow('This is not a valid ERC20 contract address');
    });
  });

  describe('createTx', () => {
    it('can create an ERC20 transaction', async () => {
      const tx = await erc20.createTx(
        wallet,
        ethKeypair,
        'method',
        18174088324,
        '0x6B92382DEdd2bb7650eB388C553568552206b102',
        0.5,
      );
      expect(tx.transaction.hash).toBe('0x04d258dbc9374f373e60c1a24d9603fe917aec8ed67a5263bb84b9a1d5958570');
    });

    it('estimateGas rejects if api returns an error', async () => {
      mockEncodeABI.estimateGas = jest.fn().mockImplementationOnce((obj, callback) => {
        const error = new Error('some error occurred');
        return callback(error, null);
      });

      try {
        await erc20.createTx(
          wallet,
          ethKeypair,
          'method',
          18174088324,
          '0x6B92382DEdd2bb7650eB388C553568552206b102',
          0.5,
        );
      } catch (e) {
        expect(e).toEqual(Error('some error occurred'));
      }
    });
  });

  describe('broadcastTx', () => {
    it('can broadcast an ERC20 transaction', async () => {
      mockWeb3.eth.sendSignedTransaction.mockImplementation((rawTx, callback) => { 
        return callback(undefined, '0x60e2442755380793f15d0629a191a65ee20b272dfc4ccadd5c0b180be7c88d58');
      });
      const raw = '0xf86b0585043b429484830186a09426705403968a8c73656a2fed0f89245698718f3f80866d6574686f642aa03e8b4aba0d20ce4ff24325ff87fca3b5fa02cd905312adf08c45ee5367ee9916a07c0cf2debe0b68c586b058d08cc35f23462cf83e461b26e44839f73ea48e9b50';
      const tx = await erc20.broadcastTx(raw, network);
      expect(tx.hash).toBe('0x60e2442755380793f15d0629a191a65ee20b272dfc4ccadd5c0b180be7c88d58');
    });

    it('it rejects if there is an error when broadcasting a tx', async () => {
      mockWeb3.eth.sendSignedTransaction.mockImplementation((rawTx, callback) => { 
        const error = new Error('Some error occurred');
        return callback(error);
      });
      try {
        await erc20.broadcastTx('123', network);
      } catch(e) {
        expect(e).toEqual(Error('Some error occurred'));
      }
    });
  });

  describe('transfer', () => {
    it('can transfer an ERC20 transaction', async () => {
      mockEncodeABI.estimateGas = jest.fn().mockImplementation((obj, callback) => {
        return callback(null, 25000);
      })
      const tx = await erc20.transfer(
        wallet,
        ethKeypair,
        '0x6B92382DEdd2bb7650eB388C553568552206b102',
        0.5,
        18174088324,
      );
      expect(tx.transaction.hash).toBe('0x04d258dbc9374f373e60c1a24d9603fe917aec8ed67a5263bb84b9a1d5958570');
    });
  });

  describe('approveAccount', () => {
    it('can approve an erc20 transfer', async () => {
      const tx = await erc20.approveAccount(
        wallet,
        ethKeypair,
        '0x6B92382DEdd2bb7650eB388C553568552206b102',
        0.5,
        18174088324,
      );
      expect(tx.transaction.hash).toBe('0x04d258dbc9374f373e60c1a24d9603fe917aec8ed67a5263bb84b9a1d5958570');
    });
  });

  describe('transferAllowance', () => {
    it('can create a transaction that transfers an allowance', async () => {
      mockCall.call.mockResolvedValue(5);
      const tx = await erc20.transferAllowance(
        wallet,
        ethKeypair,
        '0x6B92382DEdd2bb7650eB388C553568552206b102',
        0.5,
        18174088324,
      );
      expect(tx.transaction.hash).toBe('0x04d258dbc9374f373e60c1a24d9603fe917aec8ed67a5263bb84b9a1d5958570');
    });

    it('can check if the allowance before transfering', async () => {
      mockCall.call.mockResolvedValue(5);
      const tx = await erc20.transferAllowance(
        wallet,
        ethKeypair,
        '0x6B92382DEdd2bb7650eB388C553568552206b102',
        6,
        18174088324,
      );
      expect(tx).toBe('You don\'t have enough allowance');
    });
  });

  describe('checkAllowance', () => {
    it('can create atransaction that transfers an allowance', async () => {
      mockCall.call.mockResolvedValue(5);
      const allowance = await erc20.checkAllowance(
        wallet,
        '0x6B92382DEdd2bb7650eB388C553568552206b102',
      );
      expect(allowance).toBe(5);
    });
  });

  describe('getBalance', () => {
    it('can get the balance of an ERC20 token', async () => {
      mockCall.call.mockResolvedValue(5);
      const balance = await erc20.getBalance(
        wallet,
      );
      expect(balance).toBe(0.005);
    });
  });

  describe('getTokenData', () => {
    it('can get data of an ERC20 token', async () => {
      mockWeb3.eth.getCode.mockResolvedValueOnce('valid');
      mockCall.call.mockResolvedValueOnce(5);
      mockCall.call.mockResolvedValueOnce(3);
      mockCall.call.mockResolvedValueOnce('Catalyst');
      mockCall.call.mockResolvedValueOnce('CAT');
      const tokenData = await erc20.getTokenData(
        '0x26705403968a8c73656a2fed0f89245698718f3f',
        network,
      );
      expect(tokenData).toEqual({
        name: 'Catalyst',
        symbol: 'CAT',
        decimals: 3,
      });
    });

    it('can detect an invalid smart contract address', async () => {
      mockWeb3.eth.getCode.mockResolvedValueOnce('0x');
      const tokenData = await erc20.getTokenData(
        '0x26705403968a8c73656a2fed0f89245698718f3f',
        network,
      )
        .catch((e: Error) => expect(e.message).toBe('This is not a valid ERC20 contract address'));
      expect(tokenData).toBeUndefined();
    });

    it('can detect an invalid ERC20 contract address', async () => {
      mockWeb3.eth.getCode.mockResolvedValueOnce('valid');
      mockCall.call.mockRejectedValueOnce(new Error('method does not exist'));
      const tokenData = await erc20.getTokenData(
        '0x26705403968a8c73656a2fed0f89245698718f3f',
        network,
      )
        .catch((e: Error) => expect(e.message).toBe('Not a valid ERC20 contract address'));
      expect(tokenData).toBeUndefined();
    });

    it('can return empty if data is found', async () => {
      mockWeb3.eth.getCode.mockResolvedValueOnce('valid');
      mockCall.call.mockResolvedValueOnce(5);
      mockCall.call.mockRejectedValueOnce(new Error('method does not exist'));
      const tokenData = await erc20.getTokenData(
        '0x26705403968a8c73656a2fed0f89245698718f3f',
        network,
      );
      expect(tokenData).toBeUndefined();
    });
  });

  describe('getTransactionHistory', () => {
    it('can get the transaction history of an ERC20 token', async () => {
      mockAxios.get.mockResolvedValue({ data: mockERC20TransactionHistory });
      const history = await erc20.getTransactionHistory(
        wallet,
      );
      expect(history).toHaveLength(6);
    });

    it('can detect if there is no history', async () => {
      mockAxios.get.mockResolvedValue({ data: {} });
      const history = await erc20.getTransactionHistory(
        wallet,
      );
      expect(history).toBeUndefined();
    });

    it('can detect an api error', async () => {
      mockAxios.get.mockRejectedValue(new Error('Failed to get transaction history'));
      const history = await erc20.getTransactionHistory(
        wallet,
      ).catch((e: Error) => expect(e.message).toMatch('Failed to get transaction history'));
      expect(history).toBeUndefined();
    });
  });
});
