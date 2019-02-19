/* eslint-disable import/no-unresolved */
/* eslint-disable no-inner-declarations */
import Bitcoin from './SDKS/bitcoin';
import Ethereum from './SDKS/ethereum';
import ERC20 from './SDKS/erc20';
import * as ISDK from './SDKS/ISDK';

export namespace CryptoWallet {

  export function createSDK(sdk: string) {
    switch (sdk) {
      case 'Bitcoin':
        return new Bitcoin();

      case 'Ethereum':
        return new Ethereum();

      case 'ERC20':
        return new ERC20();

      default:
        return new Bitcoin();
    }
  }
}
