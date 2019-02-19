
export type Wallet = {
        // eslint-disable-next-line no-restricted-globals
  external: any;
  internal: any;
  bip: number;
  type: number;
network: any;
      };

export type KeyPair = {
      publicKey: string;
      address: string;
      derivationPath: string;
      privateKey: string;
      type: string;
      network: any;
      change?: boolean;
      };

export type Address = {
      address: string;
      index: number;
      type: string;
      change?: boolean;
      };

export type Transaction = {
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
      };


