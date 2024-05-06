"use strict";
const crypto = require("crypto");

const VERSION = "QRIv1";
const EPOCH_IN_MS = Date.parse("2020-01-01T00:00:00.000Z");
const TIMESTAMP_BYTE_LENGTH = 8; // For high-resolution timestamps
const RANDOM_BYTE_LENGTH = 16; // Length of the random segment
const CHECKSUM_BYTE_LENGTH = 32; // Use first 32 characters of a SHA-512 hash
const SIGNATURE_BYTE_LENGTH = 512;

class QRI {
  constructor(timestamp, randomSegment, checksum, signature = "") {
    this.version = VERSION;
    this.timestamp = timestamp;
    this.randomSegment = randomSegment;
    this.checksum = checksum;
    this.signature = signature;
  }

  toString() {
    return (
      `${this.version}-${this.timestamp}-${this.randomSegment}-${this.checksum}` +
      (this.signature ? `-${this.signature}` : "")
    );
  }

  static generate(options = {}) {
    const { privateKey } = options;
    const timestamp = this.formatTimestamp(new Date());
    const randomSegment = this.generateRandomSegment();
    const dataToHash = `${VERSION}-${timestamp}-${randomSegment}`;
    const checksum = this.generateChecksum(dataToHash);
    const signature = privateKey
      ? this.generateSignature(dataToHash, privateKey)
      : "";

    return new QRI(timestamp, randomSegment, checksum, signature);
  }

  static formatTimestamp(date) {
    return (
      `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}` +
      `${String(date.getDate()).padStart(2, "0")}${String(
        date.getHours()
      ).padStart(2, "0")}` +
      `${String(date.getMinutes()).padStart(2, "0")}${String(
        date.getSeconds()
      ).padStart(2, "0")}` +
      `${String(date.getMilliseconds()).padStart(3, "0")}`
    );
  }

  static generateRandomSegment() {
    const buffer = crypto.randomBytes(RANDOM_BYTE_LENGTH);
    return buffer.toString("hex");
  }

  static generateChecksum(data) {
    return crypto
      .createHash("sha512")
      .update(data)
      .digest("hex")
      .substring(0, CHECKSUM_BYTE_LENGTH);
  }

  static generateSignature(data, privateKey) {
    if (!privateKey) {
      console.error("Private key is required for generating signature.");
      return "";
    }
    try {
      const sign = crypto.createSign("sha512");
      sign.update(data);
      sign.end();
      return sign.sign(privateKey, "hex").substring(0, SIGNATURE_BYTE_LENGTH);
    } catch (error) {
      console.error("Error generating signature:", error);
      return ""; // Return empty string to indicate failure gracefully
    }
  }

  static parse(qriString) {
    const parts = qriString.split("-");
    if (parts.length < 4 || parts[0] !== VERSION) {
      throw new Error("Invalid QRI format");
    }
    const [version, timestamp, randomSegment, checksum, signature = ""] = parts;
    return new QRI(timestamp, randomSegment, checksum, signature);
  }

  static isValid(qri, publicKey = null) {
    const regeneratedChecksum = this.generateChecksum(
      `${VERSION}-${qri.timestamp}-${qri.randomSegment}`
    );
    if (publicKey && qri.signature) {
      return (
        regeneratedChecksum === qri.checksum &&
        this.validateSignature(qri, publicKey)
      );
    }
    return regeneratedChecksum === qri.checksum;
  }

  static validateSignature(qri, publicKey) {
    try {
      const verify = crypto.createVerify("sha512");
      verify.update(`${qri.version}-${qri.timestamp}-${qri.randomSegment}`);
      verify.end();
      return verify.verify(publicKey, Buffer.from(qri.signature, "hex")); // Ensure signature is a buffer
    } catch (error) {
      console.error("Signature validation failed:", error);
      return false; // Consider failing safely by returning false
    }
  }

  static qrid() {
    return this.generate().toString();
  }
}

module.exports = QRI;
