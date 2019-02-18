import BitcoinSDK from './SDKS/bitcoin';
import EthereumSDK from './SDKS/ethereum';
import ERC20SDK from './SDKS/erc20';
export declare namespace CryptoWallet {
    function createSDK(sdk: string): BitcoinSDK | EthereumSDK | ERC20SDK;
}
