import { ECPair } from 'bitcoinjs-lib';

    declare interface Wallet{
        // eslint-disable-next-line no-restricted-globals
        external: any;
        internal: any;
        bip: number;
        type: number;
        network: any;
      }

      declare interface KeyPair{
        publicKey: string;
        address: string;
        derivationPath: string;
        privateKey: string;
        type: string;
        network: any;
        change?: boolean;
      }

      declare interface Address{
        address: string;
        index: number;
        type: string;
        change?: boolean;
      }

      declare interface Transaction{
        fee: number;
        change: string[];
        receiver: string[];
        confirmed: boolean;
        confirmations: number;
        hash: string;
        blockHeight: number;
        sent: boolean;
        value: number;
        sender: string[],
        receivedTime: number;
        confirmedTime: any;
      }


