/* eslint-disable import/no-unresolved */
/* eslint-disable no-inner-declarations */
import BitcoinSDK from './SDKS/bitcoin';
import EthereumSDK from './SDKS/ethereum';
import ERC20SDK from './SDKS/erc20';
import * as ISDK from './SDKS/ISDK';

export namespace CryptoWallet {

  export function createSDK(sdk: string): ISDK.CryptoWallet.SDKS.ISDK {
    switch (sdk) {
      case 'Bitcoin':
        return new BitcoinSDK();

      case 'Ethereum':
        return new EthereumSDK();

      default:
        return new BitcoinSDK();
    }
  }
}
