import GenericSDK from '../GenericSDK';
import * as IEthereumSDK from './IEthereumSDK';
export declare namespace CryptoWallet.SDKS.Ethereum {
    class EthereumSDK extends GenericSDK implements IEthereumSDK.CryptyoWallet.SDKS.Ethereum.IEthereumSDK {
        private ethereumlib;
        /**
         *
         * @param entropy
         * @param cointype
         */
        generateHDWallet(entropy: string): Object;
        /**
         *
         * @param wallet
         * @param index
         */
        generateKeyPair(wallet: any, index: number): Object;
        /**
         *
         * @param wif
         */
        importWIF(wif: string): Object;
        /**
         *
         * @param keys
         */
        gernerateP2SHMultiSig(keys: string[]): Object;
        /**
         *
         * @param options
         */
        createRawTx(keypair: any, toAddress: String, amount: number): Object;
        broadcastTx(rawTx: object, network: string): Object;
        /**
         *
         * @param tx
         */
        verifyTxSignature(tx: any): boolean;
        /**
         *
         */
        create1t1tx(): String;
        /**
         *
         */
        create2t2tx(txparams: any): String;
    }
}
declare const _default: typeof CryptoWallet.SDKS.Ethereum.EthereumSDK;
export default _default;
