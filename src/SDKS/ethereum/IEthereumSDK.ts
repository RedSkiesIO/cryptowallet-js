export namespace CryptyoWallet.SDKS.Ethereum {
  export interface IEthereumSDK {

    generateHDWallet(entropy: string): Object;
  }
}
