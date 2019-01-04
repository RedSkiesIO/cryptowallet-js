/* eslint-disable import/no-unresolved */
import * as Mocha from 'mocha';
import * as Chai from 'chai';
import { CryptoWallet } from '../../src/SDKFactory';

const { assert } = Chai;
const { expect } = Chai;
const eth: any = CryptoWallet.createSDK('Ethereum');
const erc20: any = CryptoWallet.createSDK('ERC20');
const entropy = 'nut mixture license bean page mimic iron spice rail uncover then warfare';
const network = 'ETHEREUM_ROPSTEN';
const tokenContract = '0x26705403968A8C73656a2fEd0f89245698718F3F';
const decimals = '3';
const ethWallet = eth.generateHDWallet(entropy, network);
const ethAccount = eth.generateKeyPair(ethWallet, 0);
const sendAddress = '0x156AE1c2797494353C143070D01D5E4903bE2EB3';

describe('ERC20SDK (wallet)', () => {
  it('can create an ERC20 wallet', () => {
    const erc20Wallet = erc20.generateERC20Wallet(ethAccount, 'Atlas Token', 'ACT', tokenContract, decimals);
    expect(Object.keys(erc20Wallet).length).to.equal(10);
  });

  it('can get the balance of a wallet', async () => {
    const erc20Wallet = erc20.generateERC20Wallet(ethAccount, 'Atlas Token', 'ACT', tokenContract, decimals);
    const balance = await erc20.getBalance(erc20Wallet);
    // console.log('balance :', balance);
  });

  it('can create a erc20 token transfer raw transaction', async () => {
    const erc20Wallet = erc20.generateERC20Wallet(ethAccount, 'Atlas Token', 'ACT', tokenContract, decimals);
    const gasPrice = await eth.getTransactionFee(network);
    const transferERC20 = await erc20.transfer(erc20Wallet, sendAddress, 0.001, gasPrice.low);
    expect(eth.verifyTxSignature(transferERC20)).to.equal(true);
  });


  //   it('can geet the transaction history', async () => {
  //     const erc20Wallet = erc20.generateERC20Wallet(ethAccount, 'Atlas Token', 'ACT', tokenContract, decimals);
  //     const history = await erc20.getERC20TransactionHistory(erc20Wallet);
  //     console.log('history :', history);
  //   });
});

