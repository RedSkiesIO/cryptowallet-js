import GenericSDK from '../GenericSDK';
import * as IEthereumSDK from './IEthereumSDK';
export declare namespace CryptoWallet.SDKS.Ethereum {
    class EthereumSDK extends GenericSDK implements IEthereumSDK.CryptyoWallet.SDKS.Ethereum.IEthereumSDK {
        private ethereumlib;
        private web3;
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
         * @param keypair
         * @param toAddress
         * @param amount
         */
        createRawTx(keypair: any, toAddress: String, amount: number): Object;
        /**
         *
         * @param rawTx
         * @param network
         */
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
        getWalletHistory(addresses: Array<String>, network: string, lastBlock: number, full?: boolean): Object;
        accountDiscovery(entropy: string, network: string, internal?: boolean): Object;
    }
}
declare const _default: typeof CryptoWallet.SDKS.Ethereum.EthereumSDK;
export default _default;
