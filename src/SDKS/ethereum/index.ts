

import GenericSDK from '../GenericSDK';
import * as IEthereumSDK from './IEthereumSDK';
import * as bip44hdkey from 'ethereumjs-wallet/hdkey'
import * as Wallet from 'ethereumjs-wallet';
import * as EthereumTx from 'ethereumjs-tx';

namespace CryptoWallet.SDKS.Ethereum {
  export class EthereumSDK extends GenericSDK {

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
      const address = addrNode.getWallet().getChecksumAddressString();

      return [
        {
          string: address,
          derivationPath: `m/44'/60'/0'/0/${index}`,
          signingKey: new Buffer(wallet.privateKey, 'hex'),
          type: 'STANDARD'
        }
      ];

    }

    importWIF(wif: import("/home/stephen/Documents/crypto-wallet/cryptowallet-js/src/SDKS/IWIF").CryptyoWallet.SDKS.IWIF): Object {
      let wallet = Wallet.fromPrivateKey(wif);
      return wallet
    }
    gernerateP2SHMultiSig(key1: string, key2: string, key3: string): Object {
      throw new Error("Method not used for ethereum.");
    }
    generateTestNetAddress(): Object {
      throw new Error("Method not used for ethereum.");
    }
    createTX(options: any): Object {
      const tx = new EthereumTx(options);
      tx.sign(options.privateKey);
      return tx.serialize();
    }
    verifyTxSignature(tx: EthereumTx): boolean {
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
