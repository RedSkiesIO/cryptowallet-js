// eslint-disable-next-line import/no-unresolved
import { KeyPair } from '../GenericSDK.d';

export namespace CryptoWallet.SDKS.Ethereum {
  export interface IEthereumSDK {

    createEthTx(
      keypair: KeyPair,
      toAddress: string,
      amount: number,
      gasPrice: number,
    ): Object;

  }
}
