import * as ISDK from './ISDK';
import * as IWIF from './IWIF';
import * as bip39 from 'bip39';
import * as bip44hdkey from 'hdkey';

export namespace CryptoWallet.SDKS {
  export abstract class GenericSDK implements ISDK.CryptoWallet.SDKS.ISDK {


    generateHDWallet(entropy: string, cointype: number): Object {
      const root = bip44hdkey.fromMasterSeed(bip39.mnemonicToSeed(entropy));//root of node tree
      let externalNode, internalNode;
      if (cointype == 0 || 1) {
        externalNode = root.derive(`m/49'/${cointype}'/0'/0`);
        internalNode = root.derive(`m/49'/${cointype}'/0'/1`);//needed for bitcoin
      }
      else {
        externalNode = root.derive(`m/44'/${cointype}'/0'/0`);
        internalNode = root.derive(`m/44'/${cointype}'/0'/1`);//needed for bitcoin
      }
      return {
        root,
        externalNode,
        internalNode
      }
    };

    abstract generateKeyPair(wallet: any, index: number): Object;

    abstract importWIF(wif: string): Object;

    abstract gernerateP2SHMultiSig(keys: Array<string>): Object;

    abstract createTX(options: Object): Object;

    abstract verifyTxSignature(transaction: object): boolean;

    abstract create1t1tx(): Object;

    abstract create2t2tx(): Object;
  }

}

export default CryptoWallet.SDKS.GenericSDK;
