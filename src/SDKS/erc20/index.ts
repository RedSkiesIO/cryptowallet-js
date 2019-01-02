/* eslint-disable import/no-unresolved */

import * as EthereumTx from 'ethereumjs-tx';
import * as Web3 from 'web3';
import * as Axios from 'axios';
import * as IERC20SDK from './IERC20SDK';
import Ethereum from '../ethereum';
import * as ERC20JSON from './erc20.ts';
import * as Networks from '../networks';

export namespace CryptoWallet.SDKS.ERC20 {
  export class ERC20SDK implements IERC20SDK.CryptoWallet.SDKS.Erc20.IERC20SDK {
    json: any = ERC20JSON

    networks: any = Networks

    axios: any = Axios

    Tx: any = EthereumTx

    Wallet: any

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
      keypair: any,
      tokenName: string,
      tokenSymbol: string,
      contractAddress: string,
      decimals: number,
    ): Object {
      const web3 = new Web3(new Web3.providers.HttpProvider(keypair.network.provider));
      const abiArray = this.json.contract;
      const contract = new web3.eth.Contract(abiArray, contractAddress);
      const privateKey = Buffer.from(keypair.privateKey.substr(2), 'hex');

      return {
        keypair,
        address: keypair.address,
        network: keypair.network,
        name: tokenName,
        symbol: tokenSymbol,
        contract: contractAddress,
        decimals,
        web3,
        contractInstance: contract,
        privateKey,
      };
    }

    /**
     * Only used internally to create a transaction object
     * @param erc20Wallet
     * @param method
     */
    createTx(erc20Wallet: any, method: any) {
      return new Promise((resolve, reject) => {
        erc20Wallet.web3.eth.getTransactionCount(
          erc20Wallet.address, (err: any, nonce: any) => {
            if (err) {
              return reject(err);
            }
            const tx = new this.Tx({
              nonce,
              gasPrice: erc20Wallet.web3.utils.toHex(erc20Wallet.web3.utils.toWei('20', 'gwei')),
              gasLimit: erc20Wallet.web3.utils.toHex(100000),
              to: erc20Wallet.contract,
              value: 0,
              data: method,
              chainId: erc20Wallet.network.chainId,
            });

            tx.sign(erc20Wallet.privateKey);
            const raw = `0x${tx.serialize().toString('hex')}`;
            return resolve(raw);
          },
        );
      });
    }

    /**
     * Create a transaction that transafers ERC20 tokens to a give address
     * @param erc20Wallet
     * @param to
     * @param amount
     */
    transferERC20(erc20Wallet: any, to: string, amount: number): Object {
      const sendAmount = amount.toString();
      const method = erc20Wallet.contractInstance.methods.transfer(to, sendAmount).encodeABI();
      return this.createTx(erc20Wallet, method);
    }

    /**
     * Create a transaction that approves another account to transafer ERC20 tokens
     * @param erc20Wallet
     * @param to
     * @param amount
     */
    approveAccountERC20(erc20Wallet: any, to: string, amount: number): Object {
      const sendAmount = amount.toString();
      const method = erc20Wallet.contractInstance.methods.approve(to, sendAmount).encodeABI();
      return this.createTx(erc20Wallet, method);
    }

    /**
     * Create a transaction that transfers money from another account
     * @param erc20Wallet
     * @param from
     * @param amount
     */
    transferAllowanceERC20(erc20Wallet: any, from: string, amount: number): Object {
      return new Promise(async (resolve, reject) => {
        const check = await this.checkAllowanceERC20(erc20Wallet, from);

        if (check >= amount) {
          const sendAmount = amount.toString();
          const method = erc20Wallet.contractInstance.methods.transferFrom(
            from, erc20Wallet.address, sendAmount,
          ).encodeABI();
          const tx = this.createTx(erc20Wallet, method);
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
    checkAllowanceERC20(erc20Wallet: any, from: string): Object {
      this.Wallet = erc20Wallet;
      return new Promise(async (resolve, reject) => {
        this.Wallet.contractInstance.methods.allowance(from, erc20Wallet.address).call()
          .then((result: any) => resolve(result));
      });
    }

    /**
     * Gets the balance of the ERC20 token on a users ethereum account
     * @param erc20Wallet
     */
    getERC20Balance(erc20Wallet: any): Object {
      this.Wallet = erc20Wallet;
      return new Promise(async (resolve, reject) => {
        this.Wallet.contractInstance.methods.balanceOf(erc20Wallet.address).call()
          .then((result: any) => {
            const balance = result / (10 ** erc20Wallet.decimals);
            return resolve(balance);
          });
      });
    }

    /**
     * gets the transaction histroy of the ERC20 token on a users Ethereum account
     * @param erc20Wallet
     * @param lastBlock
     */
    getERC20TransactionHistory(erc20Wallet: any, lastBlock?: number): Object {
      return new Promise(async (resolve, reject) => {
        let URL = `${erc20Wallet.network.getErc20TranApi + erc20Wallet.contract}&address=${erc20Wallet.address}&startblock=${lastBlock}&sort=desc&apikey=${this.networks.ethToken}`;
        if (typeof lastBlock === 'undefined') {
          URL = `${erc20Wallet.network.getErc20TranApi + erc20Wallet.contract}&address=${erc20Wallet.address}&sort=desc&apikey=${this.networks.ethToken}`;
          console.log(URL);
        }
        await this.axios.get(URL)
          .then(async (res: any) => {
            if (!res.data.result) {
              return resolve();
            }

            const transactions: any = [];

            // const nextBlock: number = 0//res.data.result[0].blockNumber
            res.data.result.forEach((r: any) => {
              const receiver = r.to; let sent = false; let confirmed = false;
              const contractCall = false;
              if (r.from === erc20Wallet.address.toLowerCase()) {
                sent = true;
              }
              if (r.confirmations > 11) {
                confirmed = true;
              }

              const transaction = {
                hash: r.hash,
                blockHeight: r.blockNumber,
                fee: r.cumulativeGasUsed,
                sent,
                value: r.value,
                sender: r.from,
                receiver,
                confirmed,
                confirmedTime: r.timeStamp,

              };

              transactions.push(transaction);
            });
            return resolve(transactions);
          });
      });
    }
  }
}
export default CryptoWallet.SDKS.ERC20.ERC20SDK;
