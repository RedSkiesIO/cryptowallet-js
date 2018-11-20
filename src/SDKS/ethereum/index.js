'use strict'
var __extends = (this && this.__extends) || (function () {
  var extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p] }
    return extendStatics(d, b)
  }
  return function (d, b) {
    extendStatics(d, b)
    function __ () { this.constructor = d }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __())
  }
})()
exports.__esModule = true
var GenericSDK_1 = require('../GenericSDK')
var bip44hdkey = require('ethereumjs-wallet/hdkey')
var Wallet = require('ethereumjs-wallet')
var EthereumTx = require('ethereumjs-tx')
var CryptoWallet;
(function (CryptoWallet) {
  var SDKS;
  (function (SDKS) {
    var Ethereum;
    (function (Ethereum) {
      var EthereumSDK = /** @class */ (function (_super) {
        __extends(EthereumSDK, _super)
        function EthereumSDK () {
          return _super !== null && _super.apply(this, arguments) || this
        }
        EthereumSDK.prototype.generateHDWallet = function (entropy, cointype) {
          var wallet = _super.prototype.generateHDWallet.call(this, entropy, 60)
          wallet.privateKey = wallet.root.privateKey.toString('hex')
          return {
            privateKey: wallet.privateKey,
            mnemonic: wallet.mnemonic,
            externalAddresses: this.generateKeyPair(wallet, 0)
          }
        }
        EthereumSDK.prototype.generateKeyPair = function (wallet, index) {
          var addrNode = bip44hdkey.fromExtendedKey(wallet.externalNode.publicExtendedKey).deriveChild(index)
          var address = addrNode.getWallet().getChecksumAddressString()
          return [
            {
              string: address,
              derivationPath: "m/44'/60'/0'/0/" + index,
              signingKey: new Buffer(wallet.privateKey, 'hex'),
              type: 'STANDARD'
            }
          ]
        }
        EthereumSDK.prototype.exportWIF = function (wallet, password) {
          return wallet.toV3(password)
        }
        EthereumSDK.prototype.importWIF = function (wif) {
          var wallet = Wallet.fromPrivateKey(wif)
          return wallet
        }
        EthereumSDK.prototype.gernerateP2SHMultiSig = function (key1, key2, key3) {
          throw new Error('Method not implemented.')
        }
        EthereumSDK.prototype.generateTestNetAddress = function () {
          throw new Error('Method not implemented.')
        }
        EthereumSDK.prototype.createTX = function (options) {
          var tx = new EthereumTx(options)
          tx.sign(options.privateKey)
          return tx.serialize()
        }
        EthereumSDK.prototype.verifyTxSignature = function (tx) {
          if (tx.verifySignature()) {
            return true
          } else {
            return false
          }
        }
        EthereumSDK.prototype.create1t1tx = function () {
          throw new Error('Method not implemented.')
        }
        EthereumSDK.prototype.create2t2tx = function () {
          throw new Error('Method not implemented.')
        }
        return EthereumSDK
      }(GenericSDK_1['default']))
    })(Ethereum = SDKS.Ethereum || (SDKS.Ethereum = {}))
  })(SDKS = CryptoWallet.SDKS || (CryptoWallet.SDKS = {}))
})(CryptoWallet || (CryptoWallet = {}))
exports['default'] = CryptoWallet.SDKS.Ethereum.EthereumSDK
