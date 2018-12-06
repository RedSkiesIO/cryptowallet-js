export namespace CryptyoWallet.SDKS.Bitcoin {
  export interface IBitcoinSDK {

    generateSegWitAddress(keypair: any): object;

    generateSegWitP2SH(keypair: any): object;

    generateSegWit3of4MultiSigAddress(key1: string, key2: string, key3: string, key4: string): Object;

    create1t1tx(keypair: any, txHash: string, txNumber: number, address: string, amount: number): Object;

    create2t2tx(txparams: any): Object;

    gernerateP2SHMultiSig(keys: Array<string>): Object;

    getUTXOs(addresses: Array<String>, network: string): Object;
  }
}
