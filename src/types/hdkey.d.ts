// Type definitions for hdkey 0.7
// Project: https://github.com/cryptocoinjs/hdkey
// Definitions by: Leonid Logvinov <https://github.com/LogvinovLeon>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference types="node"/>

export class HDNode {
    static fromMasterSeed(seed: Buffer): HDNode;
    publicKey: Buffer;
    privateKey: Buffer;
    chainCode: Buffer;
    constructor();
    derive(path: string): HDNode;
}
export function fromMasterSeed(seed: Buffer): any;
export function derive(path: string): any;

