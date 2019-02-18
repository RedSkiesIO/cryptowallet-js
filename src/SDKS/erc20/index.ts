/* eslint-disable import/no-unresolved */
// eslint-disable-next-line spaced-comment
///<reference path="../../types/module.d.ts" />
import EthereumTx from 'ethereumjs-tx';
import Web3 from 'web3';
import * as Axios from 'axios';
import { KeyPair } from '../GenericSDK.d';
import * as IERC20SDK from './IERC20SDK';
import * as ERC20JSON from './erc20';
import * as Networks from '../networks';


export namespace CryptoWallet.SDKS.ERC20 {
  export class ERC20SDK implements IERC20SDK.CryptoWallet.SDKS.Erc20.IERC20SDK {
    json: any = ERC20JSON

    networks: any = Networks

    axios: any = Axios

    Tx: any = EthereumTx

    Wallet: any

    Contract: any

    Web3: any = Web3

    /**
     * Creates an object containg all the information relating to a ERC20 token
     *  and the account it's stored on
     * @param keypair
     * @param tokenName
     * @param tokenSymbol
     * @param contractAddress
     * @param decimals
     */
    generateERC20Wallet(
      keypair: KeyPair,
      tokenName: string,
      tokenSymbol: string,
      contractAddress: string,
      decimals: number,
    ): Object {
      const web3: any = new this.Web3(keypair.network.provider);
      const abiArray = this.json.contract;
      const contract = new web3.eth.Contract(this.json.contract, contractAddress);
      // const privateKey = Buffer.from(keypair.privateKey.substr(2), 'hex');

      return {
        decimals,
        address: keypair.address,
        network: keypair.network,
        name: tokenName,
        symbol: tokenSymbol,
        contract: contractAddress,
        contractInstance: contract,
      };
    }

    /**
     * Only used internally to create a raw transaction
     * @param erc20Wallet
     * @param method
     */
    createTx(
      erc20Wallet: any,
      keypair: KeyPair,
      method: any,
      gasPrice: number,
      to?: string,
      amount?: number,
    ): Object {
      const web3 = new this.Web3(erc20Wallet.network.provider);
      return new Promise((resolve, reject) => {
        web3.eth.getTransactionCount(
          erc20Wallet.address, (err: any, nonce: any) => {
            if (err) {
              return reject(new Error(err));
            }
            const gas = gasPrice.toString();
            const tx = new this.Tx({
              nonce,
              gasPrice: web3.utils.toHex(gas),
              gasLimit: web3.utils.toHex(100000),
              to: erc20Wallet.contract,
              value: 0,
              data: method,
              chainId: erc20Wallet.network.chainId,
            });

            tx.sign(keypair.privateKey);
            const raw = `0x${tx.serialize().toString('hex')}`;
            const fee = (gasPrice * 100000).toString();
            const transaction = {
              fee,
              hash: web3.utils.sha3(raw),
              receiver: to,
              confirmed: false,
              confirmations: 0,
              blockHeight: -1,
              sent: true,
              value: amount,
              sender: erc20Wallet.address,
              receivedTime: new Date().getTime() / 1000,
              confirmedTime: new Date().getTime() / 1000,
            };

            return resolve({
              hexTx: raw,
              transaction,
            });
          },
        )
          .catch((e: any) => reject(e));
      });
    }

    /**
    *  Broadcast an Ethereum transaction
    * @param rawTx
    * @param network
    */
    broadcastTx(
      rawTx: string,
      network: string,
    ): Object {
      const web3: any = new this.Web3(this.networks[network].provider);
      return new Promise((resolve, reject) => {
        web3.eth.sendSignedTransaction(rawTx, (err: Error, result: string) => {
          if (err) return reject(err);
          return resolve(result);
        })
          .catch((e: Error) => reject(e));
      });
    }

    /**
     * Create a transaction that transafers ERC20 tokens to a give address
     * @param erc20Wallet
     * @param to
     * @param amount
     */
    transfer(
      erc20Wallet: any,
      keypair: KeyPair,
      to: string,
      amount: number,
      gasPrice: number,
    ): Object {
      const web3: any = new this.Web3(erc20Wallet.network.provider);
      const contract = new web3.eth.Contract(this.json.contract, erc20Wallet.contract);
      const sendAmount: string = (amount * (10 ** erc20Wallet.decimals)).toString();
      const method = contract.methods.transfer(to, sendAmount).encodeABI();

      return this.createTx(erc20Wallet, keypair, method, gasPrice, to, amount);
    }

    /**
     * Create a transaction that approves another account to transfer ERC20 tokens
     * @param erc20Wallet
     * @param to
     * @param amount
     */
    approveAccount(
      erc20Wallet: any,
      keypair: KeyPair,
      to: string,
      amount: number,
      gasPrice: number,
    ): Object {
      const web3: any = new this.Web3(erc20Wallet.network.provider);
      const contract = new web3.eth.Contract(this.json.contract, erc20Wallet.contract);
      const sendAmount: string = (amount * (10 ** erc20Wallet.decimals)).toString();
      const method = contract.methods.approve(to, sendAmount).encodeABI();
      return this.createTx(erc20Wallet, keypair, method, gasPrice);
    }

    /**
     * Create a transaction that transfers money from another account
     * @param erc20Wallet
     * @param from
     * @param amount
     */
    transferAllowance(
      erc20Wallet: any,
      keypair: KeyPair,
      from: string,
      amount: number,
      gasPrice: number,
    ): Object {
      return new Promise(async (resolve, reject) => {
        const web3: any = new this.Web3(erc20Wallet.network.provider);
        const contract = new web3.eth.Contract(this.json.contract, erc20Wallet.contract);
        const check: number = await this.checkAllowance(erc20Wallet, from);

        if (check >= amount) {
          const sendAmount: string = (amount * (10 ** erc20Wallet.decimals)).toString();
          const method = contract.methods.transferFrom(
            from, erc20Wallet.address, sendAmount,
          ).encodeABI();
          const tx = this.createTx(erc20Wallet, keypair, method, gasPrice);
          return resolve(tx);
        }

        return resolve("You don't have enough allowance");
      });
    }

    /**
     * Checks how much can be transfered from another account
     * @param erc20Wallet
     * @param from
     */
    checkAllowance(
      erc20Wallet: any,
      from: string,
    ): Promise<number> {
      this.Wallet = erc20Wallet;
      return new Promise(async (resolve, reject) => {
        const web3: any = new this.Web3(erc20Wallet.network.provider);
        const contract = new web3.eth.Contract(this.json.contract, erc20Wallet.contract);
        contract.methods.allowance(from, erc20Wallet.address).call()
          .then((result: number) => resolve(result));
      });
    }

    /**
     * Gets the balance of the ERC20 token on a users ethereum account
     * @param erc20Wallet
     */
    getBalance(
      erc20Wallet: any,
    ): Promise<number> {
      this.Wallet = erc20Wallet;
      return new Promise(async (resolve, reject) => {
        const web3: any = new this.Web3(erc20Wallet.network.provider);
        const contract = new web3.eth.Contract(this.json.contract, erc20Wallet.contract);
        contract.methods.balanceOf(erc20Wallet.address).call()
          .then((result: number) => {
            const balance: number = result / (10 ** erc20Wallet.decimals);
            return resolve(balance);
          })
          .catch((e: Error) => reject(e));
      });
    }

    getTokenData(
      address: string,
      network: string,
    ): Object {
      return new Promise(async (resolve, reject) => {
        const web3: any = new this.Web3(this.networks[network].provider);
        const abiArray = this.json.contract;

        const contract = new web3.eth.Contract(abiArray, address);
        const valid: string = await web3.eth.getCode(address);
        if (valid === '0x') {
          return reject(new Error('This is not a valid ERC20 contract address'));
        }
        await contract.methods.balanceOf('0xcc345035D14458B3C012977f96fA1E116760D60a').call()
          .catch((error: Error) => reject(new Error('Not a valid ERC20 contract address')));

        try {
          const decimals: number = await contract.methods.decimals().call();
          const name: string = await contract.methods.name().call();
          const symbol: string = await contract.methods.symbol().call();
          return resolve({
            name,
            symbol,
            decimals,
          });
        } catch (err) {
          return resolve();
        }
      });
    }

    /**
     * gets the transaction histroy of the ERC20 token on a users Ethereum account
     * @param erc20Wallet
     * @param lastBlock
     */
    getTransactionHistory(
      erc20Wallet: any,
      startBlock?: number,
    ): Object {
      return new Promise(async (resolve, reject) => {
        let URL: string = `${erc20Wallet.network.getErc20TranApi + erc20Wallet.contract}&address=${erc20Wallet.address}&startblock=${startBlock}&sort=desc&apikey=${this.networks.ethToken}`;
        if (typeof startBlock === 'undefined') {
          URL = `${erc20Wallet.network.getErc20TranApi + erc20Wallet.contract}&address=${erc20Wallet.address}&sort=desc&apikey=${this.networks.ethToken}`;
        }
        await this.axios.get(URL)
          .then(async (res: any) => {
            if (!res.data.result) {
              return resolve();
            }
            const transactions: object[] = [];
            // const nextBlock: number = 0//res.data.result[0].blockNumber
            res.data.result.forEach((r: any) => {
              const receiver: string = r.to;
              let sent: boolean = false;
              let confirmed: boolean = false;

              if (r.from === erc20Wallet.address.toLowerCase()) {
                sent = true;
              }
              if (r.confirmations > 11) {
                confirmed = true;
              }

              const transaction: object = {
                hash: r.hash,
                blockHeight: r.blockNumber,
                fee: r.cumulativeGasUsed / 1000000000,
                sent,
                value: r.value / (10 ** erc20Wallet.decimals),
                sender: r.from,
                receiver,
                confirmed,
                confirmedTime: r.timeStamp,
                confirmations: r.confirmations,

              };

              transactions.push(transaction);
            });
            return resolve(transactions);
          })
          .catch((e: Error) => reject(e));
      });
    }
  }
}
export default CryptoWallet.SDKS.ERC20.ERC20SDK;
