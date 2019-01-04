/* eslint-disable import/no-unresolved */
import * as Mocha from 'mocha';
import * as Chai from 'chai';
import { CryptoWallet } from '../../src/SDKFactory';
import ERC20 from '../../src/SDKS/erc20';

const { assert } = Chai;

const { expect } = Chai;
const eth: any = CryptoWallet.createSDK('Ethereum');
const erc20 = new ERC20();
const entropy = 'nut mixture license bean page mimic iron spice rail uncover then warfare';
const network = 'ETHEREUM_ROPSTEN';
const rootKey: string = 'xprv9s21ZrQH143K468LbsXz8YqCZjiP1ZCLXy4nV352PWToQYEi1WxeEDKzWRd3vWbSfUjQuFAPwPMPG1KRVtsLDc3YvD7X1MktbTzcmsEqjPw';


const bip = 44;
const address1 = '0x1ceBf494c8d33948e4Ec8E9d026cb46cd152B3bc';
const privKey1 = '0xd701f769f4878f79369d5fa87cfa661b978d284121019d41d654b2ccbb40fc2c';
const pubKey1 = '0x02201bde53932f1eae0c3108c26ac2de2d7662faeb59fd8ef552ec9d40310187bc';
const derPath = 'm/44\'/60\'/0\'/0/0';

describe('ethereumSDK (wallet)', () => {
  it('can create a HD wallet', () => {
    const wallet: any = eth.generateHDWallet(entropy, network);

    expect(wallet.mnemonic).to.equal(entropy);
    expect(wallet.privateKey).to.equal(rootKey);
    expect(wallet.bip).to.equal(bip);
    expect(wallet.type).to.equal(60);
  });

  it('can create a key pair', () => {
    const wallet: any = eth.generateHDWallet(entropy, network);
    const keypair: any = eth.generateKeyPair(wallet, 0);
    assert.strictEqual(keypair.derivationPath, derPath);
    assert.strictEqual(keypair.address, '0x8f97Bb9335747E4fCdDA8680F66ed96DcBe27F49');
    assert.strictEqual(
      keypair.privateKey, '0x42193c2610f6f7ff06becfef595b4810d8808bdfee1dba819f69686353093f73',
    );
    assert.strictEqual(keypair.type, 'Ethereum');
  });

  it('can generate an address', () => {
    const wallet: any = eth.generateHDWallet(entropy, network);
    const account: any = eth.generateAddress(wallet, 0);
    assert.strictEqual(account.address, '0x8f97Bb9335747E4fCdDA8680F66ed96DcBe27F49');
  });

  it('can validate an address', () => {
    assert.strictEqual(eth.validateAddress('0x8f97Bb9335747E4fCdDA8680F66ed96DcBe27F49', network), true);
  });

  it('can import key from WIF', () => {
    const keypair: any = eth.importWIF(
      '42193c2610f6f7ff06becfef595b4810d8808bdfee1dba819f69686353093f73', network,
    );

    assert.strictEqual(keypair.address, '0x8f97Bb9335747E4fCdDA8680F66ed96DcBe27F49');
    assert.strictEqual(
      keypair.privateKey, '0x42193c2610f6f7ff06becfef595b4810d8808bdfee1dba819f69686353093f73',
    );
  });

  it('can restore a wallet from the mnemonic', async () => {
    const accounts: any = await eth.accountDiscovery(entropy, 'ETHEREUM_ROPSTEN');
    expect(accounts.length).to.equal(10);
  });

  it('can get the transaction history of a wallet', async () => {
    const wallet = eth.generateHDWallet(entropy, 'ETHEREUM_ROPSTEN');
    const addresses = [];

    for (let i: number = 0; i < 10; i += 1) {
      const key: any = eth.generateKeyPair(wallet, i);
      addresses.push(key.address);
    }

    const history = await eth.getTransactionHistory(addresses, 'ETHEREUM_ROPSTEN', 0);
    expect(history.txs.length).to.equal(14);
  });

  it('can get the latest gas price for ethereum', async () => {
    const gasPrice = await eth.getTransactionFee('ETHEREUM_ROPSTEN');
    expect(Object.keys(gasPrice).length).to.equal(6);
    expect(gasPrice).to.have.property('high');
    expect(gasPrice).to.have.property('medium');
    expect(gasPrice).to.have.property('low');
  });

  it('can create a transaction', async () => {
    const wallet: any = eth.generateHDWallet(entropy, network);
    const keypair: any = eth.generateKeyPair(wallet, 0);
    const receiver: any = eth.generateAddress(wallet, 1);

    const rawTx = await eth.createEthTx(keypair, receiver.address, 0.01, 15750062047);
    const verify = eth.verifyTxSignature(rawTx.hexTx);
    assert.strictEqual(verify, true);
  });

  it('can verify a transaction', async () => {
    const rawTx = '0xf86c068504a817c800830186a0946b92382dedd2bb7650eb388c553568552206b102872386f26fc10000802aa0837567fed905d394cc2989a123a9f1eba323686aa57998bb7cc494ca9b7a0257a04f9c73182687d917152f78c2be4652d71ea73b045e9932ffa93936b27b316a58';
    expect(eth.verifyTxSignature(rawTx)).to.equal(true);
  });

  // it('can get the balance of an account', async () => {
  //   const balance = await eth.getBalance(['0x156AE1c2797494353C143070D01D5E4903bE2EB3'], network);
  //   console.log('balance :', balance);
  // });

  //   it('can get the transaction history of an ERC20 wallet', async () => {
  //     const wallet = eth.generateHDWallet(entropy, 'ETHEREUM_ROPSTEN');
  //     const contract = '0x26705403968a8c73656a2fed0f89245698718f3f';
  //     const keypair: any = eth.generateKeyPair(wallet, 0);
  //     const erc20Wallet: any = erc20.generateERC20Wallet(
  //       keypair, 'Atlas City Token', 'ACT', contract, 3
  // );

  //     const history = await erc20.getERC20TransactionHistory(erc20Wallet);
  //     console.log(history);
  //   });
});


