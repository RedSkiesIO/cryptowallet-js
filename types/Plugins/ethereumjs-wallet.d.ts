declare module ethereumjsWallet {
    export function fromEthSale(input: any, password: any): any;
    export function fromExtendedPrivateKey(priv: any): any;
    export function fromExtendedPublicKey(pub: any): any;
    export function fromPrivateKey(priv: any): any;
    export function fromPublicKey(pub: any, nonStrict: any): any;
    export function fromV1(input: any, password: any): any;
    export function fromV3(input: any, password: any, nonStrict: any): any;
    export function generate(icapDirect: any): any;
    export function generateVanityAddress(pattern: any): any;
    export function constructor(priv: any, pub: any): any;
    export function getAddress(): any;
    export function getAddressString(): any;
    export function getChecksumAddressString(): any;
    export function getPrivateKey(): any;
    export function getPrivateKeyString(): any;
    export function getPublicKey(): any;
    export function getPublicKeyString(): any;
    export function getV3Filename(timestamp: any): any;
    export function toV3(password: any, opts: any): any;
    export function toV3String(password: any, opts: any): any;
    export function fromPrivateKey(priv: any): any;
}