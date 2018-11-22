/*!
 * cryptowallet-js v0.0.1 
 * (c) 2018 James Kirkby
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.CryptowalletJs = factory());
}(this, (function () { 'use strict';

	var CryptoWallet$1 = CryptoWallet.CryptoWalletJS;

	return CryptoWallet$1;

})));
