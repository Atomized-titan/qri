# Quantum-Resistant Identifier (QRI) System

The Quantum-Resistant Identifier (QRI) system provides a robust, secure method for generating identifiers that are resistant to quantum computing attacks. This package allows for the generation of QRIs with optional cryptographic signature verification for enhanced security in distributed systems.

## Features

- **Quantum-Resistant Security**: Uses `SHA-512` for checksums and `RSA` for optional signatures.
- **High-Resolution Timestamps**: Ensures unique and traceable identifiers.
- **Configurable**: Supports generation with or without cryptographic signatures.

## Installation

To install the QRID package, run the following command in your project directory:

```bash
npm install qrid
```

## Usage

### Basic Usage

To generate a QRI without a cryptographic signature:

```javascript
const QRI = require("qrid");

async function generateQRI() {
  const qri = QRI.generate();
  console.log("Generated QRI:", qri.toString());
}

generateQRI();
```

### Generating QRIs with Signatures

To generate a QRI with a cryptographic signature, you must provide a private key:

```javascript
const QRI = require("qrid");

const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA....YOUR_PRIVATE_KEY....AQABAoIBAQCyD....
-----END RSA PRIVATE KEY-----`;

async function generateQRIWithSignature() {
  const qri = QRI.generate(privateKey);
  console.log("Generated QRI with Signature:", qri.toString());
}

generateQRIWithSignature();
```

### Validating QRIs

To validate a QRI (with or without a signature):

```javascript
const QRI = require("qrid");

async function validateQRI() {
  const qri = QRI.generate();
  const isValid = QRI.isValid(qri);
  console.log("Is the QRI valid?", isValid);
}

validateQRI();
```

## Examples

Here are some additional examples of how to use the QRI package:

### Decode a QRI String

```javascript
const qriString = "QRIv1-20210101120000123-abcd1234abcd-12345678-1a2b3c";
const qri = QRI.parse(qriString);
console.log("Decoded QRI:", qri);
```

### Generating a QRI with Digital Signature

To generate a QRI with RSA digital signature:

```javascript
const crypto = require("crypto");
const QRI = require("qrid");

// Generate RSA keys synchronously
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: { type: "spki", format: "pem" },
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
});

async function generateAndValidateQRI() {
  try {
    const qriInstance = QRI.generate({ privateKey });
    const qriString = qriInstance.toString();

    console.log(`Generated QRI with signature: ${qriString}`);

    // Parse and validate signature
    const parsedQRI = QRI.parse(qriString);
    if (QRI.validateSignature(parsedQRI, publicKey)) {
      console.log("Signature is valid.");
    } else {
      console.log("Signature is invalid.");
    }
  } catch (error) {
    console.error("Error during QRI generation or validation:", error);
  }
}

generateAndValidateQRI();
```

## Troubleshooting

### Signature Length

- **Important**: Ensure that the `SIGNATURE_BYTE_LENGTH` is correctly set based on the key size. For a 2048-bit RSA key, the signature length should be 256 bytes, which translates to 512 hexadecimal characters. Improper signature length might result in invalid signatures.

### Common Issues

- **Signature Validation Failure**: This often occurs if the signature has been truncated or if there's a mismatch in the key used for signing and verification. Check that you're using the correct public and private keys and that the entire signature is included during the generation and validation process.

### Warning

- **Identifier Length**: Using RSA signatures will significantly increase the length of the identifier due to the inclusion of the digital signature. Ensure that your storage solution or use case can accommodate longer strings.

## Contributing

Contributions to the QRI package are welcome! Here are ways you can contribute:

- Submit bugs and feature requests.
- Review source code changes.
- Contribute improvements or fixes using Pull Requests.

Please read `CONTRIBUTING.md` for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the `LICENSE.md` file for details.
