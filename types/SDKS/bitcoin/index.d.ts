import GenericSDK from '../GenericSDK';
import * as IBitcoinSDK from './IBitcoinSDK';
declare namespace CryptoWallet.SDKS.Bitcoin {
    class BitcoinSDK extends GenericSDK implements IBitcoinSDK.CryptyoWallet.SDKS.Bitcoin.IBitcoinSDK {
        private bitcoinlib;
        generateHDWallet(entropy: any, cointype: number, testnet?: boolean): Object;
        generateKeyPair(wallet: any, index: number, external?: boolean): Object;
        generateSegWitAddress(keyPair: any): Object;
        generateSegWitP2SH(keyPair: any): Object;
        generateSegWit3of4MultiSigAddress(key1: string, key2: string, key3: string, key4: string): Object;
        importWIF(wif: string): Object;
        gernerateP2SHMultiSig(keys: Array<string>): Object;
        createTX(options: any): Object;
        verifyTxSignature(transaction: any): boolean;
        create1t1tx(): Object;
        create2t2tx(): Object;
    }
}
declare const _default: typeof CryptoWallet.SDKS.Bitcoin.BitcoinSDK;
export default _default;
