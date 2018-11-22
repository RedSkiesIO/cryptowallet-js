export function entropyToMnemonic(entropy: any, wordlist: any): any;
export function generateMnemonic(strength: any, rng: any, wordlist: any): any;
export function mnemonicToEntropy(mnemonic: any, wordlist: any): any;
export function mnemonicToSeed(mnemonic: any): any;
export function mnemonicToSeedHex(mnemonic: any, password: any): any;
export function validateMnemonic(mnemonic: any, wordlist: any): any;
export const wordlists: {
  EN: string[];
  JA: string[];
  chinese_simplified: string[];
  chinese_traditional: string[];
  english: string[];
  french: string[];
  italian: string[];
  japanese: string[];
  korean: string[];
  spanish: string[];
};