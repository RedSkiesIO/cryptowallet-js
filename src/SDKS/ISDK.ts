import * as IWIF from './IWIF';

export namespace CryptyoWallet.SDKS {
  export interface ISDK {

    generateKeyPair(entropy: string, cointype: number): Object;

    importWIF(wif: IWIF.CryptyoWallet.SDKS.IWIF): Object;

    gernerateP2SHMultiSig(key1: string, key2: string, key3: string): Object;

    generateTestNetAddress(): Object;

    create1t1tx(): Object;

    create2t2tx(): Object;

    verifyTxSignature(signature: string): boolean;

  }
}
