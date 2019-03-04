import Bitcoin from './SDKS/bitcoin';
import Ethereum from './SDKS/ethereum';
import ERC20 from './SDKS/erc20';

namespace CryptoWallet {
  export const createSDK = function SDKFactory(sdk: string) {
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
  };
}
export default CryptoWallet;
