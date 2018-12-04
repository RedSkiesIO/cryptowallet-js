"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Chai = require("chai");
const SDKFactory_1 = require("../../src/SDKFactory");
var assert = Chai.assert;
const expect = Chai.expect;
const eth = SDKFactory_1.CryptoWallet.createSDK('Ethereum');
const entropy = 'nut mixture license bean page mimic iron spice rail uncover then warfare';
const network = 'ETHEREUM';
const rootKey = 'xprv9s21ZrQH143K468LbsXz8YqCZjiP1ZCLXy4nV352PWToQYEi1WxeEDKzWRd3vWbSfUjQuFAPwPMPG1KRVtsLDc3YvD7X1MktbTzcmsEqjPw';
const bip = 44;
const address1 = '0x1ceBf494c8d33948e4Ec8E9d026cb46cd152B3bc';
const privKey1 = '0xd701f769f4878f79369d5fa87cfa661b978d284121019d41d654b2ccbb40fc2c';
const pubKey1 = '0x02201bde53932f1eae0c3108c26ac2de2d7662faeb59fd8ef552ec9d40310187bc';
const derPath = `m/44'/60'/0'/0/0`;
describe('ethereumSDK (wallet)', () => {
    it('can create a HD wallet', () => {
        const wallet = eth.generateHDWallet(entropy, network);
        expect(wallet.mnemonic).to.equal(entropy);
        expect(wallet.privateKey).to.equal(rootKey);
        expect(wallet.bip).to.equal(bip);
        expect(wallet.type).to.equal(60);
    });
    it('can create a key pair', () => {
        const wallet = eth.generateHDWallet(entropy, network);
        const keypair = eth.generateKeyPair(wallet, 0);
        assert.strictEqual(keypair.derivationPath, derPath);
        assert.strictEqual(keypair.address, '0x8f97Bb9335747E4fCdDA8680F66ed96DcBe27F49');
        assert.strictEqual(keypair.privateKey, '0x42193c2610f6f7ff06becfef595b4810d8808bdfee1dba819f69686353093f73');
        assert.strictEqual(keypair.type, 'Ethereum');
    });
    it('can import key from WIF', () => {
        const keypair = eth.importWIF('42193c2610f6f7ff06becfef595b4810d8808bdfee1dba819f69686353093f73');
        assert.strictEqual(keypair.address, '0x8f97Bb9335747E4fCdDA8680F66ed96DcBe27F49');
        assert.strictEqual(keypair.privateKey, '0x42193c2610f6f7ff06becfef595b4810d8808bdfee1dba819f69686353093f73');
    });
    // it('can get the transaction history of a wallet', async () => {
    //   const addresses = ['0x156AE1c2797494353C143070D01D5E4903bE2EB3']
    //   const tData: any = await eth.getWalletHistory(addresses, 'ETHEREUM', 0, true)
    //   console.log(tData)
    // })
    // it('can createTX', () => {
    //   const wallet: any = eth.generateHDWallet(entropy, network)
    //   const keypair: any = eth.generateKeyPair(wallet, 0)
    //   const keypair2: any = eth.generateKeyPair(wallet, 1)
    //   const rawTx = eth.createRawTx(keypair, keypair2.address, 0.01)
    //   console.log(rawTx)
    //   // const verify = eth.verifyTxSignature(rawTx)
    //   // assert.strictEqual(verify, true)
    // })
});
