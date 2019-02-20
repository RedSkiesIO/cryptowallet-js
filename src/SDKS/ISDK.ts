// eslint-disable-next-line import/no-unresolved
import { Wallet, KeyPair, Address } from './GenericSDK.d';

export namespace CryptoWallet.SDKS {
  export interface ISDK {
    generateHDWallet(
      entropy: string,
      network: string,
    ): Wallet;

    generateKeyPair(
      wallet: object,
      index: number,
      internal?: boolean,
    ): KeyPair;

    generateAddress(
      wallet: Wallet,
      index: number,
      internal?: boolean,
    ): Address;

    importWIF(
      wif: string,
      network: string,
    ): Object;

    createRawTx(
      accounts: object[],
      change: string[],
      utxos: any,
      wallet: Wallet,
      toAddress: string,
      amount: number,
      feeRate: number,
      max?: boolean,
    ): Object;

    broadcastTx(
      rawTx: string,
      network: string,
    ): Object;

    validateAddress(
      address: string,
      network: string,
    ): boolean;

    getTransactionFee(
      network: string,
    ): Object;

    verifyTxSignature(
      transaction: object,
      network: string,
    ): boolean;

    accountDiscovery(
      wallet: Wallet,
      internal?: boolean,
    ): Object;

    getTransactionHistory(
      addresses: string[],
      network: string,
      from: number,
      to: number,
    ): Object;

    getBalance(
      addresses: string[],
      network: string,
    ): Object;

    // getPriceFeed(
    //   coins: string[],
    //   currencies: string[],
    // ): Object;

    // getHistoricalData(
    //   coin: string,
    //   currency: string,
    //   period: string,
    // ): Object;
  }
}
