export namespace CryptyoWallet.SDKS.Bitcoin {
  export interface IBitcoinSDK {

    generateSegWitAddress(keypair: any): object;

    generateSegWitP2SH(keypair: any): object;

    generateSegWit3of4MultiSigAddress(key1: string, key2: string, key3: string, key4: string): Object;

  }
}
