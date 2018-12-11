
import * as IERC20SDK from './IERC20SDK'
import Ethereum from '../ethereum'
import * as EthereumTx from 'ethereumjs-tx'
import * as Web3 from 'web3'
import * as ERC20JSON from './erc20.ts'
import * as Networks from '../networks'
import * as Axios from 'axios'

export namespace CryptoWallet.SDKS.ERC20 {
    export class ERC20SDK implements IERC20SDK.CryptoWallet.SDKS.Erc20.IERC20SDK {

        json: any = ERC20JSON
        networks: any = Networks
        axios: any = Axios

        generateERC20Wallet(keypair: any, tokenName: string, tokenSymbol: string, contractAddress: string, decimals: number): Object {

            const web3 = new Web3(new Web3.providers.HttpProvider(keypair.network.provider))
            const abiArray = this.json.contract;
            const contract = new web3.eth.Contract(abiArray, contractAddress);
            const privateKey = new Buffer(keypair.privateKey.substr(2), 'hex')

            return {
                keypair: keypair,
                address: keypair.address,
                network: keypair.network,
                name: tokenName,
                symbol: tokenSymbol,
                contract: contractAddress,
                decimals: decimals,
                web3: web3,
                contractInstance: contract,
                privateKey: privateKey
            }

        }
        createTx(erc20Wallet: any, method: any) {

            return new Promise((resolve, reject) => {
                erc20Wallet.web3.eth.getTransactionCount(erc20Wallet.address, function (err: any, nonce: any) {
                    if (err) {
                        return reject(err)
                    }
                    const tx = new EthereumTx({
                        nonce: nonce,
                        gasPrice: erc20Wallet.web3.utils.toHex(erc20Wallet.web3.utils.toWei('20', 'gwei')),
                        gasLimit: erc20Wallet.web3.utils.toHex(100000),
                        to: erc20Wallet.contract,
                        value: 0,
                        data: method,
                        chainId: erc20Wallet.network.chainId
                    })

                    tx.sign(erc20Wallet.privateKey)
                    const raw = '0x' + tx.serialize().toString('hex')
                    console.log(raw)
                    return resolve(raw)
                })
            })


        }

        transferERC20(erc20Wallet: any, to: string, amount: number): Object {
            const sendAmount = amount.toString()
            const method = erc20Wallet.contractInstance.methods.transfer(to, sendAmount).encodeABI()
            return this.createTx(erc20Wallet, method)
        }

        approveAccountERC20(erc20Wallet: any, to: string, amount: number): Object {
            const sendAmount = amount.toString()
            const method = erc20Wallet.contractInstance.methods.approve(to, sendAmount).encodeABI()
            return this.createTx(erc20Wallet, method)
        }

        transferAllowanceERC20(erc20Wallet: any, from: string, amount: number): Object {

            return new Promise(async (resolve, reject) => {
                const check = await this.checkAllowanceERC20(erc20Wallet, from)

                if (check >= amount) {
                    const sendAmount = amount.toString()
                    const method = erc20Wallet.contractInstance.methods.transferFrom(from, erc20Wallet.address, sendAmount).encodeABI()
                    const tx = this.createTx(erc20Wallet, method)
                    return resolve(tx)
                }
                else {
                    return reject("You don't have enough allowance")
                }
            })
        }

        checkAllowanceERC20(erc20Wallet: any, from: string): Object {
            return new Promise(async (resolve, reject) => {
                erc20Wallet.contractInstance.methods.allowance(from, erc20Wallet.address).call()
                    .then(function (result: any) {
                        return resolve(result)
                    })
            })

        }

        getERC20Balance(erc20Wallet: any): Object {
            return new Promise(async (resolve, reject) => {
                erc20Wallet.contractInstance.methods.balanceOf(erc20Wallet.address).call()
                    .then(function (result: any) {
                        const balance = result / Math.pow(10, erc20Wallet.decimals)
                        return resolve(balance)
                    })
            })
        }
        getERC20TransactionHistory(erc20Wallet: any, lastBlock?: number): Object {
            return new Promise(async (resolve, reject) => {


                let URL = 'http://api-ropsten.etherscan.io/api?module=account&action=tokentx&contractaddress=' + erc20Wallet.contract + '&address=' + erc20Wallet.address + '&startblock=' + lastBlock + '&sort=desc&apikey=' + this.networks.ethToken
                if (typeof lastBlock === 'undefined') {
                    URL = 'http://api-ropsten.etherscan.io/api?module=account&action=tokentx&contractaddress=' + erc20Wallet.contract + '&address=' + erc20Wallet.address + '&sort=desc&apikey=' + this.networks.ethToken
                }
                await this.axios.get(URL)
                    .then(async (res: any) => {
                        if (!res.data.result) {
                            return resolve()
                        }
                        else {
                            let transactions: any = []

                            //const nextBlock: number = 0//res.data.result[0].blockNumber
                            res.data.result.forEach((r: any) => {
                                let receiver = r.to, sent = false, confirmed = false, contractCall = false
                                if (r.from === erc20Wallet.address.toLowerCase()) {
                                    sent = true
                                }
                                if (r.confirmations > 11) {
                                    confirmed = true

                                }


                                const transaction = {
                                    hash: r.hash,
                                    blockHeight: r.blockNumber,
                                    fee: r.cumulativeGasUsed,
                                    sent: sent,
                                    value: r.value,
                                    sender: r.from,
                                    receiver: receiver,
                                    confirmed: confirmed,
                                    confirmedTime: r.timeStamp

                                }

                                transactions.push(transaction)
                            })
                            return resolve(transactions)
                        }

                    })

            })

        }




    }
}
export default CryptoWallet.SDKS.ERC20.ERC20SDK