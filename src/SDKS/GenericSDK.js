var CryptyoWallet;
(function (CryptyoWallet) {
    var SDKS;
    (function (SDKS) {
        var GenericSDK = (function () {
            function GenericSDK() {
            }
            return GenericSDK;
        })();
        SDKS.GenericSDK = GenericSDK;
    })(SDKS = CryptyoWallet.SDKS || (CryptyoWallet.SDKS = {}));
})(CryptyoWallet = exports.CryptyoWallet || (exports.CryptyoWallet = {}));
exports["default"] = CryptyoWallet.SDKS.GenericSDK;
