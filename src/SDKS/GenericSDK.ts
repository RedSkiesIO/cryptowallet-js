import * as ISDK from './ISDK';
import * as IWIF from './IWIF';

export namespace CryptyoWallet.SDKS {
  export abstract class GenericSDK implements ISDK.CryptyoWallet.SDKS.ISDK {

    abstract generateKeyPair(entropy : string) : Object;

    abstract importWIF(wif : IWIF.CryptyoWallet.SDKS.IWIF) : Object;

    abstract gernerateP2SHMultiSig(key1 : string, key2 : string, key3 : string) : Object;

    abstract generateTestNetAddress() : Object;

    abstract createTX() : Object;

    abstract verifyTxSignature(signature : string) : boolean;
  }
}

export default CryptyoWallet.SDKS.GenericSDK;
