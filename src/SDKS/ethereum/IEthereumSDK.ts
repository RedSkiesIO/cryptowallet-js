// eslint-disable-next-line import/no-unresolved
import { KeyPair } from 'GenericSDK';

export namespace CryptyoWallet.SDKS.Ethereum {
  export interface IEthereumSDK {

    createEthTx(
      keypair: KeyPair,
      toAddress: string,
      amount: number,
      gasPrice: number,
    ): Object;

  }
}
