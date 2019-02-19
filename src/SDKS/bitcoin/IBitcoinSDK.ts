// eslint-disable-next-line import/no-unresolved
// import { KeyPair, Wallet } from 'SDKS/GenericSDK';
import { ECPair } from 'bitcoinjs-lib';
// eslint-disable-next-line import/no-unresolved
import { Wallet, KeyPair } from '../GenericSDK.d';

export namespace CryptoWallet.SDKS.Bitcoin {
  export interface IBitcoinSDK {
    generateSegWitAddress(
      keypair: KeyPair,
    ): string;

    generateSegWitP2SH(
      keypair: KeyPair,
    ): string;

    generateSegWit3of4MultiSigAddress(
      key1: string,
      key2: string,
      key3: string,
      key4: string,
      network: string,
    ): string;

    create1t1tx(
      keypair: ECPair,
      txHash: string,
      txNumber: number,
      address: string,
      amount: number,
    ): String;

    create2t2tx(
      txparams: any,
    ): String;

    gernerateP2SHMultiSig(
      keys: string[],
      network: string,
    ): Object;

    getUTXOs(
      addresses: string[],
      network: string,
    ): Object;

    createTxToMany(
      accounts: object[],
      change: string[],
      utxos: any,
      wallet: Wallet,
      toAddresses: string[],
      amounts: number[],
      minerRate: number,
    ): Object;
  }
}
