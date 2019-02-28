/* eslint-disable import/no-unresolved */
import 'jest';
import axios from 'axios';
import * as Web3 from 'web3';
import { CryptoWallet } from '../../src/SDKFactory';

const erc20: any = CryptoWallet.createSDK('ERC20');
const eth: any = CryptoWallet.createSDK('Ethereum');
const entropy = 'nut mixture license bean page mimic iron spice rail uncover then warfare';
const network = 'ETHEREUM_ROPSTEN';

// mock web3
jest.genMockFromModule('web3');
jest.mock('web3');
// const constructor = jest.fn();

// jest.mock('web3', () => ({
//   ...jest.requireActual('web3'),
// //   eth: {
// //     getTransactionCount: jest.fn(),
// //     sendSignedTransaction: jest.fn(),
// //   },
// }));

const jestWeb3: any = Web3;

const mockWeb3 = {
  utils: {
    toHex: jest.fn(() => 0),
    sha3: jest.fn(() => 0),
  },
  eth: {
    getTransactionCount: jest.fn(() => 5),
    sendSignedTransaction: jest.fn(),
    Contract: jest.fn(),
  },
};
const mockCall = {
  call: jest.fn(),
};
const mockTransfer = {
  encodeABI: jest.fn(),
};
const mockContract = {
  methods: {
    transfer: jest.fn(() => mockTransfer),
    approve: jest.fn(() => mockTransfer),
    transferFrom: jest.fn(() => mockTransfer),
    allowance: jest.fn(() => mockCall),
  },
};

jestWeb3.mockImplementation(() => mockWeb3);
mockWeb3.eth.Contract.mockImplementation(() => mockContract);
// mockContract.methods.transfer.mockImplementation(() => mockTransfer);

describe('ERC20SDK', () => {
  describe('generateERC20Wallet', () => {
    it('can create an ERC20 wallet', () => {
      const ethWallet = eth.generateHDWallet(entropy, network);
      const ethKeypair = eth.generateKeyPair(ethWallet, 0);
      const wallet = erc20.generateERC20Wallet(
        ethKeypair,
        'Catalyst',
        'CAT',
        '0x26705403968a8c73656a2fed0f89245698718f3f',
        3,
      );
      expect(wallet.address).toBe('0x8f97Bb9335747E4fCdDA8680F66ed96DcBe27F49');
    });
  });

  describe('createTx', () => {
    it('can create an ERC20 transaction', async () => {
      // web3.eth.getTransactionCount.mockResolvedValue(5);
      const ethWallet = eth.generateHDWallet(entropy, network);
      const ethKeypair = eth.generateKeyPair(ethWallet, 0);
      const wallet = erc20.generateERC20Wallet(
        ethKeypair,
        'Catalyst',
        'CAT',
        '0x26705403968a8c73656a2fed0f89245698718f3f',
        3,
      );
      const tx = await erc20.transfer(
        wallet,
        ethKeypair,
        '0x6B92382DEdd2bb7650eB388C553568552206b102',
        0.5,
        18174088324,
      );
      expect(tx.transaction.hash).toBe(0);
    });
  });

  describe('transfer', () => {
    it('can transfer an ERC20 transaction', async () => {
      // web3.eth.getTransactionCount.mockResolvedValue(5);
      const ethWallet = eth.generateHDWallet(entropy, network);
      const ethKeypair = eth.generateKeyPair(ethWallet, 0);
      const wallet = erc20.generateERC20Wallet(
        ethKeypair,
        'Catalyst',
        'CAT',
        '0x26705403968a8c73656a2fed0f89245698718f3f',
        3,
      );
      const tx = await erc20.transfer(
        wallet,
        ethKeypair,
        '0x6B92382DEdd2bb7650eB388C553568552206b102',
        0.5,
        18174088324,
      );
      expect(tx.transaction.hash).toBe('0x0a58760c9b6acc44337bd77a2d4f11c4881bc4577acedd144308cd5718788aa0');
    });
  });

  describe('approveAccount', () => {
    it('can approve an erc20 transfer', async () => {
      // web3.eth.getTransactionCount.mockResolvedValue(5);
      const ethWallet = eth.generateHDWallet(entropy, network);
      const ethKeypair = eth.generateKeyPair(ethWallet, 0);
      const wallet = erc20.generateERC20Wallet(
        ethKeypair,
        'Catalyst',
        'CAT',
        '0x26705403968a8c73656a2fed0f89245698718f3f',
        3,
      );
      const tx = await erc20.approveAccount(
        wallet,
        ethKeypair,
        '0x6B92382DEdd2bb7650eB388C553568552206b102',
        0.5,
        18174088324,
      );
      expect(tx.transaction.hash).toBe('0x8ad6543dd62fe6f0c7bd0fb1d67b50a144b1cf6fe598c8596e0e3a956faa1b39');
    });
  });

  describe('transferAllowance', () => {
    it('can create atransaction that transfers an allowance', async () => {
      // web3.eth.getTransactionCount.mockResolvedValue(5);
      const ethWallet = eth.generateHDWallet(entropy, network);
      const ethKeypair = eth.generateKeyPair(ethWallet, 0);
      const wallet = erc20.generateERC20Wallet(
        ethKeypair,
        'Catalyst',
        'CAT',
        '0x26705403968a8c73656a2fed0f89245698718f3f',
        3,
      );
      const tx = await erc20.transferAllowance(
        wallet,
        ethKeypair,
        '0x6B92382DEdd2bb7650eB388C553568552206b102',
        0.5,
        18174088324,
      );
      console.log('tx :', tx);
      // expect(tx.transaction.hash).toBe('0x8ad6543dd62fe6f0c7bd0fb1d67b50a144b1cf6fe598c8596e0e3a956faa1b39');
    });
  });
});
