"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CryptoWallet;
(function (CryptoWallet) {
    var SDKS;
    (function (SDKS) {
        var ERC20;
        (function (ERC20) {
            class ERC20SDK {
                generateERC20Wallet(ethAccount, tokenName, tokenSymbol, contractAddress, decimals) {
                    return {
                        address: ethAccount.address,
                        index: ethAccount.index,
                        wallet: ethAccount.wallet,
                        symbol: tokenSymbol,
                        contract: contractAddress,
                        decimals: decimals
                    };
                }
                transferERC20(erc20Wallet, to, amount) {
                    throw new Error("Method not implemented.");
                }
                approveAccountERC20(erc20Wallet, to, amount) {
                    throw new Error("Method not implemented.");
                }
                transferAllowanceERC20(erc20Wallet, from, amount) {
                    throw new Error("Method not implemented.");
                }
                checkAllowanceERC20(erc20Wallet, from, amount) {
                    throw new Error("Method not implemented.");
                }
                getERC20Balance(erc20Wallet) {
                    //var tokenContract = eth.contract(tokenABI).at(erc20Wallet.contract);
                    //var tokenBalance = tokenContract.balanceOf(erc20Wallet.address);
                    throw new Error("Method not implemented.");
                }
            }
            ERC20.ERC20SDK = ERC20SDK;
        })(ERC20 = SDKS.ERC20 || (SDKS.ERC20 = {}));
    })(SDKS = CryptoWallet.SDKS || (CryptoWallet.SDKS = {}));
})(CryptoWallet = exports.CryptoWallet || (exports.CryptoWallet = {}));
