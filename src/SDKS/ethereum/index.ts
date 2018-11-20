import GenericSDK from '../GenericSDK';
import * as IWIF from '../IWIF';
import * as IEthereumSDK from './IEthereumSDK';
import * as bip44hdkey from 'ethereumjs-wallet/hdkey'
import * as EthereumLib from 'ethereumjs-wallet';
import * as EthereumTx from 'ethereumjs-tx';

export namespace CryptoWallet.SDKS.Ethereum {
  export class EthereumSDK extends GenericSDK implements IEthereumSDK.CryptyoWallet.SDKS.Ethereum.IEthereumSDK {

    private ethereumlib = EthereumLib;

    generateHDWallet(entropy: string, cointype: number): Object {
      let wallet: any = super.generateHDWallet(entropy, 60);
      wallet.privateKey = wallet.root.privateKey.toString('hex')

      return {
        privateKey: wallet.privateKey,
        mnemonic: wallet.mnemonic,
        externalAddresses: this.generateKeyPair(wallet, 0)
      };

    }

    generateKeyPair(wallet: any, index: number): Object {
      const addrNode = bip44hdkey.fromExtendedKey(wallet.externalNode.publicExtendedKey).deriveChild(index);
      return [
        {
          publicKey: addrNode.getWallet().getPublicKeyString(),
          address: addrNode.getWallet().getChecksumAddressString(),
          derivationPath: `m/44'/60'/0'/0/${index}`,
          privateKey: new Buffer(wallet.privateKey, 'hex'),
          type: 'STANDARD'
        }
      ];

    }

    importWIF(wif: IWIF.CryptoWallet.SDKS.IWIF): Object {
      let wallet = this.ethereumlib.fromPrivateKey(wif);
      return wallet
    }

    gernerateP2SHMultiSig(keys: string[]): Object {
      throw new Error("Method not use for Ethereum");
    }

    createTX(options: any): Object {
      const tx: any = new EthereumTx.EthereumTx(options);
      tx.sign(options.privateKey);
      return tx.serialize();
    }

    verifyTxSignature(tx: EthereumTx.EthereumTx): boolean {

      if (tx.verifySignature()) {
        return true
      }
      else {
        return false
      }
    }

    create1t1tx(): Object {
      throw new Error("Method not used for ethereum.");
    }

    create2t2tx(): Object {
      throw new Error("Method not used for ethereum.");
    }


  }
}

export default CryptoWallet.SDKS.Ethereum.EthereumSDK;
