import GenericSDK from '../GenericSDK';
import * as IWIF from '../IWIF';
import * as IEthereumSDK from './IEthereumSDK';
import * as EthereumTx from 'ethereumjs-tx';
declare namespace CryptoWallet.SDKS.Ethereum {
    class EthereumSDK extends GenericSDK implements IEthereumSDK.CryptyoWallet.SDKS.Ethereum.IEthereumSDK {
        private ethereumlib;
        generateHDWallet(entropy: string, cointype: number): Object;
        generateKeyPair(wallet: any, index: number): Object;
        importWIF(wif: IWIF.CryptoWallet.SDKS.IWIF): Object;
        gernerateP2SHMultiSig(keys: string[]): Object;
        createTX(options: any): Object;
        verifyTxSignature(tx: EthereumTx): boolean;
        create1t1tx(): Object;
        create2t2tx(): Object;
    }
}
declare const _default: typeof CryptoWallet.SDKS.Ethereum.EthereumSDK;
export default _default;
