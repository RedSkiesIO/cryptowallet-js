"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const version = '__VERSION__';
const install = (Vue) => {
    Vue.prototype.$add = (a, b) => a + b;
};
const plugin = {
    install,
    version,
};
exports.default = plugin;
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin);
}
