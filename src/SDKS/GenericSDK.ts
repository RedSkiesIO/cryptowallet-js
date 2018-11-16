import * as ISDK from './ISDK';
import * as IWIF from './IWIF';

export namespace CryptyoWallet.SDKS {
  export abstract class GenericSDK implements ISDK.CryptyoWallet.SDKS.ISDK {

    abstract generateKeyPair(entropy : string) : Object;

    abstract importWIF(wif : IWIF.CryptyoWallet.SDKS.IWIF) : Object;

    abstract gernerateP2SHMultiSig(key1 : string, key2 : string, key3 : string) : Object;

    abstract generateSegWitAddress() : Object;

    abstract generateSegWitP2SH() : Object;

    abstract generateSegWit3of4MultiSigaddress(key1 : string, key2 : string, key3 : string) : Object;

    abstract generateTestNetAddress() : Object;

    abstract create1t1tx() : Object;

    abstract create2t2tx() : Object;

    abstract verifyTxSignature(signature : string) : boolean;
  }
}

export default CryptyoWallet.SDKS.GenericSDK;
