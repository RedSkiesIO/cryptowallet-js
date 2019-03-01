/* eslint-disable import/no-unresolved */
import 'jest';
import axios from 'axios';
import * as Web3 from 'web3';
import { CryptoWallet } from '../../src/SDKFactory';
import mockERC20TransactionHistory from '../datasets/mockERC20TransactionHistory';

const erc20: any = CryptoWallet.createSDK('ERC20');
const eth: any = CryptoWallet.createSDK('Ethereum');
const entropy = 'nut mixture license bean page mimic iron spice rail uncover then warfare';
const network = 'ETHEREUM_ROPSTEN';
const ethWallet = eth.generateHDWallet(entropy, network);
const ethKeypair = eth.generateKeyPair(ethWallet, 0);
const wallet = erc20.generateERC20Wallet(
  ethKeypair,
  'Catalyst',
  'CAT',
  '0x26705403968a8c73656a2fed0f89245698718f3f',
  3,
);

// mock web3
jest.genMockFromModule('web3');
jest.mock('web3');
jest.mock('axios');

const mockAxios: any = axios;
const jestWeb3: any = Web3;

const mockWeb3 = {
  utils: {
    toHex: jest.requireActual('web3').utils.toHex,
    sha3: jest.requireActual('web3').utils.sha3,
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

describe('ERC20SDK', () => {
  describe('generateERC20Wallet', () => {
    it('can create an ERC20 wallet', () => {
      expect(wallet.address).toBe('0x8f97Bb9335747E4fCdDA8680F66ed96DcBe27F49');
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
      expect(tx.transaction.hash).toBe('0x60e2442755380793f15d0629a191a65ee20b272dfc4ccadd5c0b180be7c88d58');
    });
  });

  describe('broadcastTx', () => {
    it('can broadcast an ERC20 transaction', async () => {
      mockWeb3.eth.sendSignedTransaction.mockResolvedValue('0x60e2442755380793f15d0629a191a65ee20b272dfc4ccadd5c0b180be7c88d58');
      const raw = '0xf86b0585043b429484830186a09426705403968a8c73656a2fed0f89245698718f3f80866d6574686f642aa03e8b4aba0d20ce4ff24325ff87fca3b5fa02cd905312adf08c45ee5367ee9916a07c0cf2debe0b68c586b058d08cc35f23462cf83e461b26e44839f73ea48e9b50';
      const tx = await erc20.broadcastTx(raw, network);
      expect(tx.hash).toBe('0x60e2442755380793f15d0629a191a65ee20b272dfc4ccadd5c0b180be7c88d58');
    });
  });

  describe('transfer', () => {
    it('can transfer an ERC20 transaction', async () => {
      const tx = await erc20.transfer(
        wallet,
        ethKeypair,
        '0x6B92382DEdd2bb7650eB388C553568552206b102',
        0.5,
        18174088324,
      );
      expect(tx.transaction.hash).toBe('0x0f357b606ee4f67c4f495ec0b26ff683411bccd2c1074d471400d0b7cb7df3d6');
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
      expect(tx.transaction.hash).toBe('0x0f357b606ee4f67c4f495ec0b26ff683411bccd2c1074d471400d0b7cb7df3d6');
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
      expect(tx.transaction.hash).toBe('0x0f357b606ee4f67c4f495ec0b26ff683411bccd2c1074d471400d0b7cb7df3d6');
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