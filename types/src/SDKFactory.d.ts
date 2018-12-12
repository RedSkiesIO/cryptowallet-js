import BitcoinSDK from './SDKS/bitcoin';
import EthereumSDK from './SDKS/ethereum';
export declare namespace CryptoWallet {
    function createSDK(sdk: string): BitcoinSDK | EthereumSDK;
}
