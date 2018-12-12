export declare namespace CryptyoWallet.SDKS.Bitcoin {
    interface IBitcoinSDK {
        generateSegWitAddress(keypair: any): object;
        generateSegWitP2SH(keypair: any): object;
        create1t1tx(keypair: any, txHash: string, txNumber: number, address: string, amount: number): Object;
        create2t2tx(txparams: any): Object;
        gernerateP2SHMultiSig(keys: string[]): Object;
        getUTXOs(addresses: string[], network: string): Object;
    }
}
