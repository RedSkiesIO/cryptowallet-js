export namespace CryptyoWallet.SDKS.Bitcoin {
  export interface IBitcoinSDK {

    generateSegWitAddress() : Object;

    generateSegWitP2SH() : Object;

    generateSegWit3of4MultiSigaddress(key1 : string, key2 : string, key3 : string) : Object;

  }
}
