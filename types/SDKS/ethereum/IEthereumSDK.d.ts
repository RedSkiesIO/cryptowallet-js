import { KeyPair } from '../GenericSDK.d';

export declare namespace CryptoWallet.SDKS.Ethereum {
    interface IEthereumSDK {
        createEthTx(keypair: KeyPair, toAddress: string, amount: number, gasPrice: number): Object;
    }
}
