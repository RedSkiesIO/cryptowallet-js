import BitcoinSDK from './SDKS/bitcoin'
import EthereumSDK from './SDKS/bitcoin'
import * as ISDK from './SDKS/ISDK';

export namespace CryptyoWallet {

  export function createSDK(sdk: string) : ISDK.CryptyoWallet.SDKS.ISDK {

    switch(sdk) {
      case "Bitcoin":
        return new BitcoinSDK();
        break;
      case "Ethereum":
        return new EthereumSDK();
        break;
      default:
        return new BitcoinSDK();
        break;
    }
  }
}
