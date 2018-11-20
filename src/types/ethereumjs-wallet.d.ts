export = index;
declare class index {
  static fromEthSale(input: any, password: any): any;
  static fromExtendedPrivateKey(priv: any): any;
  static fromExtendedPublicKey(pub: any): any;
  static fromPrivateKey(priv: any): any;
  static fromPublicKey(pub: any, nonStrict: any): any;
  static fromV1(input: any, password: any): any;
  static fromV3(input: any, password: any, nonStrict: any): any;
  static generate(icapDirect: any): any;
  static generateVanityAddress(pattern: any): any;
  constructor(priv: any, pub: any);
  getAddress(): any;
  getAddressString(): any;
  getChecksumAddressString(): any;
  getPrivateKey(): any;
  getPrivateKeyString(): any;
  getPublicKey(): any;
  getPublicKeyString(): any;
  getV3Filename(timestamp: any): any;
  toV3(password: any, opts: any): any;
  toV3String(password: any, opts: any): any;
}