/// <reference path="../../../../src/types/module.d.ts" />
import * as IBitcoinSDK from './IBitcoinSDK';
import GenericSDK from '../GenericSDK';
declare namespace CryptoWallet.SDKS.Bitcoin {
    class BitcoinSDK extends GenericSDK implements IBitcoinSDK.CryptyoWallet.SDKS.Bitcoin.IBitcoinSDK {
        Explore: any;
        Req: any;
        /**
         *
         * @param keyPair
         */
        generateSegWitAddress(keyPair: any): Object;
        /**
         *
         * @param keyPair
         */
        generateSegWitP2SH(keyPair: any): Object;
        /**
         *
         * @param key1
         * @param key2
         * @param key3
         * @param key4
         */
        /**
         *
         * @param keys
         */
        gernerateP2SHMultiSig(keys: string[]): Object;
        getUTXOs(addresses: string[], network: string): Object;
        /**
         *
         */
        create1t1tx(keypair: any, txHash: string, txNumber: number, address: string, amount: number): String;
        /**
         *
         */
        create2t2tx(txparams: any): String;
    }
}
declare const _default: typeof CryptoWallet.SDKS.Bitcoin.BitcoinSDK;
export default _default;
