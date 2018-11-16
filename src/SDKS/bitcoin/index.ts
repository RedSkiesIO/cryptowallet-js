import GenericSDK from '../GenericSDK';
import * as IBitcoinSDK from './IBitcoinSDK';
import BitcoinLib from 'bitcoinjs-lib';

declare namespace CryptyoWallet.SDKS.Bitcoin {
  class BitcoinSDK extends GenericSDK implements IBitcoinSDK.CryptyoWallet.SDKS.Bitcoin.IBitcoinSDK {

    private bitcoinlib = new BitcoinLib();

  }
}

export default CryptyoWallet.SDKS.Bitcoin.BitcoinSDK;
