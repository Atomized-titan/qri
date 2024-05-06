/// <reference types="node" />

declare class QRI {
  constructor(
    timestamp: string,
    randomSegment: string,
    checksum: string,
    signature?: string
  );

  readonly version: string;
  readonly timestamp: string;
  readonly randomSegment: string;
  readonly checksum: string;
  readonly signature: string | null;

  toString(): string;

  static generate(options?: { privateKey?: string }): Promise<QRI>;
  static formatTimestamp(date: Date): string;
  static generateRandomSegment(): string;
  static generateChecksum(data: string): string;
  static generateSignature(data: string, privateKey: string): string;
  static parse(qriString: string): QRI;
  static isValid(qri: QRI, publicKey?: string): boolean;
  static validateSignature(qri: QRI, publicKey: string): boolean;
}

export = QRI;
