import GenericSDK from '../GenericSDK';
import * as IBitcoinSDK from './IBitcoinSDK';
declare namespace CryptoWallet.SDKS.Bitcoin {
    class BitcoinSDK extends GenericSDK implements IBitcoinSDK.CryptyoWallet.SDKS.Bitcoin.IBitcoinSDK {
        /**
        *
        * @param wallet
        * @param index
        * @param external
        */
        generateKeyPair(wallet: any, index: number, internal?: boolean): Object;
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
        generateSegWit3of4MultiSigAddress(key1: string, key2: string, key3: string, key4: string): Object;
        /**
         *
         * @param wif
         */
        importWIF(wif: string): Object;
        /**
         *
         * @param keys
         */
        gernerateP2SHMultiSig(keys: Array<string>): Object;
        createRawTx(keypair: any, toAddress: string, amount: number): Object;
        /**
         *
         * @param transaction
         */
        verifyTxSignature(transaction: any): boolean;
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
