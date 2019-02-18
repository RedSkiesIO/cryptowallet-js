/*!
 * cryptowallet-js v0.0.1 
 * (c) 2019 Stephen Horsfall
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

	Object.defineProperty(exports, "__esModule", { value: true });
	var cryptoWallet_ts_1 = require("./cryptoWallet.ts");
	exports.default = cryptoWallet_ts_1.default;

})));
