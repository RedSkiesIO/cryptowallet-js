import * as ISDK from './ISDK';
import * as IWIF from './IWIF';
import * as bip39 from 'bip39';
import * as bip44hdkey from 'hdkey';

export namespace CryptyoWallet.SDKS {
  export abstract class GenericSDK implements ISDK.CryptyoWallet.SDKS.ISDK {

    abstract generateKeyPair(entropy: string, cointype: number): Object;


    generateHDWallet(entropy: string, cointype: number): Object {
      const root = bip44hdkey.fromMasterSeed(bip39.mnemonicToSeed(entropy));//root of node tree
      const externalNode = root.derive(`m/44'/${cointype}'/0'/0`);
      const internalNode = root.derive(`m/44'/${cointype}'/0'/1`);//needed for bitcoin
      return {
        root,
        externalNode,
        internalNode
      }
    };

    abstract importWIF(wif: IWIF.CryptyoWallet.SDKS.IWIF): Object;

    abstract gernerateP2SHMultiSig(key1: string, key2: string, key3: string): Object;

    abstract generateTestNetAddress(): Object;

    abstract createTX(options: Object): Object;

    abstract verifyTxSignature(signature: string): boolean;

    abstract create1t1tx(): Object;

    abstract create2t2tx(): Object;
  }

}

export default CryptyoWallet.SDKS.GenericSDK;
