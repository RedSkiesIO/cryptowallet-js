
// eslint-disable-next-line import/prefer-default-export
export type Transaction = {
        fee: string;
        receiver: string;
        contractCall?: boolean;
        confirmed: boolean;
        confirmations: number;
        hash: string;
        blockHeight: number;
        sent: boolean;
        value: number;
        sender: string,
        confirmedTime: any;
        receivedTime: number;
      };


