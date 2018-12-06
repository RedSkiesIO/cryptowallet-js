import GenericSDK from '../GenericSDK';
import * as IEthereumSDK from './IEthereumSDK';
export declare namespace CryptoWallet.SDKS.Ethereum {
    class EthereumSDK extends GenericSDK implements IEthereumSDK.CryptyoWallet.SDKS.Ethereum.IEthereumSDK {
        getUTXOs(addresses: String[], network: string): Object;
        createRawTx(accounts: object[], change: string, utxos: any, network: string, toAddress: string, amount: number): Object;
        private ethereumlib;
        private web3;
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
         * @param keypair
         * @param toAddress
         * @param amount
         */
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
        getTransactionHistory(address: string, addresses: string[], network: string, lastBlock: number, beforeBlock?: number, limit?: number): Object;
        getWalletHistory(addresses: string[], network: string, lastBlock: number, full?: boolean): Object;
        accountDiscovery(entropy: string, network: string, internal?: boolean): Object;
    }
}
declare const _default: typeof CryptoWallet.SDKS.Ethereum.EthereumSDK;
export default _default;
