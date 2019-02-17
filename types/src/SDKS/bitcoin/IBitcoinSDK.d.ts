export declare namespace CryptyoWallet.SDKS.Bitcoin {
    interface IBitcoinSDK {
        generateSegWitAddress(keypair: any): object;
        generateSegWitP2SH(keypair: any): object;
        generateSegWit3of4MultiSigAddress(key1: string, key2: string, key3: string, key4: string, network: string): Object;
        create1t1tx(keypair: any, txHash: string, txNumber: number, address: string, amount: number): Object;
        create2t2tx(txparams: any): Object;
        gernerateP2SHMultiSig(keys: string[], network: string): Object;
        getUTXOs(addresses: string[], network: string): Object;
        createTxToMany(accounts: object[], change: string[], utxos: any, wallet: any, toAddresses: string[], amounts: number[], minerRate: number): Object;
    }
}