import GenericSDK from '../GenericSDK';
import * as IWIF from '../IWIF';
import * as IEthereumSDK from './IEthereumSDK';
import * as EthereumTx from 'ethereumjs-tx';
export declare namespace CryptoWallet.SDKS.Ethereum {
    class EthereumSDK extends GenericSDK implements IEthereumSDK.CryptyoWallet.SDKS.Ethereum.IEthereumSDK {
        private ethereumlib;
        /**
         *
         * @param entropy
         * @param cointype
         */
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
        importWIF(wif: IWIF.CryptoWallet.SDKS.IWIF): Object;
        /**
         *
         * @param keys
         */
        gernerateP2SHMultiSig(keys: string[]): Object;
        /**
         *
         * @param options
         */
        createTX(options: any): Object;
        /**
         *
         * @param tx
         */
        verifyTxSignature(tx: EthereumTx.EthereumTx): boolean;
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
