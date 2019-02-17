// Type definitions for ethereumjs-tx 1.0
// Project: https://github.com/ethereumjs/ethereumjs-tx
// Definitions by: Leonid Logvinov <https://github.com/LogvinovLeon>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference types="node"/>

export function verifySignature(): boolean;
export function serialize(): Buffer;
export function sign(buffer: Buffer): void;
export function getSenderAddress(): Buffer;

export class EthereumTx {
    constructor(txParams: any);
    verifySignature(): boolean
}



