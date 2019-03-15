/**
* Copyright (c) 2019 https://atlascity.io
*
* This file is part of CryptoWallet-js <https://github.com/atlascity/cryptowallet-js>
*
* CryptoWallet-js is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 2 of the License, or
* (at your option) any later version.
*
* CryptoWallet-js is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with CryptoWallet-js. If not, see <https://www.gnu.org/licenses/>.
*/
///<reference path="../../types/module.d.ts" />
import * as EthereumTx from 'ethereumjs-tx';
import * as Web3 from 'web3';
import * as Axios from 'axios';
import { KeyPair } from '../GenericSDK.d';
import * as IERC20SDK from './IERC20SDK';
import ERC20JSON from './erc20';
import * as Networks from '../networks';

export namespace CryptoWallet.SDKS.ERC20 {
  export class ERC20SDK implements IERC20SDK.CryptoWallet.SDKS.Erc20.IERC20SDK {
    json: any = ERC20JSON;
    networks: any = Networks;
    axios: any = Axios;
    Tx: any = EthereumTx;
    wallet: any;
    contract: any;
    Web3: any = Web3;

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
      const valid = web3.utils.isAddress(contractAddress.toLowerCase());
      if (!valid) {
        throw new Error('This is not a valid ERC20 contract address');
      }
      return {
        decimals,
        address: keypair.address,
        network: keypair.network,
        name: tokenName,
        symbol: tokenSymbol,
        contract: contractAddress,
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
      return new Promise(async (resolve, reject) => {
        const nonce = await web3.eth.getTransactionCount(erc20Wallet.address);
        const gas = gasPrice.toString();
        const gasLimit = 100000;
        const tx = new this.Tx({
          nonce,
          gasPrice: web3.utils.toHex(gas),
          gasLimit: web3.utils.toHex(gasLimit),
          to: erc20Wallet.contract,
          value: 0,
          data: method,
          chainId: erc20Wallet.network.chainId,
        });
        const removePrefix = 2;
        const privateKey: Buffer = Buffer.from(keypair.privateKey.substr(removePrefix), 'hex');
        tx.sign(privateKey);
        const raw = `0x${tx.serialize().toString('hex')}`;
        const fee = (gasPrice * gasLimit).toString();
        const msToS = 1000;
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
          receivedTime: new Date().getTime() / msToS,
          confirmedTime: new Date().getTime() / msToS,
        };

        return resolve({
          hexTx: raw,
          transaction,
        });
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
      return new Promise(async (resolve, reject) => {
        const hash = await web3.eth.sendSignedTransaction(rawTx);
        return resolve({
          hash,
        });
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
      const contract = new web3.eth.Contract(this.json, erc20Wallet.contract);
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
      const contract = new web3.eth.Contract(this.json, erc20Wallet.contract);
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
        const contract = new web3.eth.Contract(this.json, erc20Wallet.contract);
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
      this.wallet = erc20Wallet;
      return new Promise(async (resolve, reject) => {
        const web3: any = new this.Web3(erc20Wallet.network.provider);
        const contract = new web3.eth.Contract(this.json, erc20Wallet.contract);
        const allowance = await contract.methods.allowance(from, erc20Wallet.address).call();
        return resolve(allowance);
      });
    }

    /**
     * Gets the balance of the ERC20 token on a users ethereum account
     * @param erc20Wallet
     */
    getBalance(
      erc20Wallet: any,
    ): Promise<number> {
      this.wallet = erc20Wallet;
      return new Promise(async (resolve, reject) => {
        const web3: any = new this.Web3(erc20Wallet.network.provider);
        const contract = new web3.eth.Contract(this.json, erc20Wallet.contract);
        const balance = await contract.methods.balanceOf(erc20Wallet.address).call();
        const adjustedBalance: number = balance / (10 ** erc20Wallet.decimals);
        return resolve(adjustedBalance);
      });
    }

    getTokenData(
      address: string,
      network: string,
    ): Object {
      return new Promise(async (resolve, reject) => {
        const web3: any = new this.Web3(this.networks[network].provider);
        const abiArray = this.json;
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
            const minConfirmations = 11;
            const convertToEth = 1000000000;
            res.data.result.forEach((r: any) => {
              const receiver: string = r.to;
              let sent: boolean = false;
              let confirmed: boolean = false;

              if (r.from === erc20Wallet.address.toLowerCase()) {
                sent = true;
              }
              if (r.confirmations > minConfirmations) {
                confirmed = true;
              }

              const transaction: object = {
                sent,
                receiver,
                confirmed,
                hash: r.hash,
                blockHeight: r.blockNumber,
                fee: r.cumulativeGasUsed / convertToEth,
                value: r.value / (10 ** erc20Wallet.decimals),
                sender: r.from,
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
