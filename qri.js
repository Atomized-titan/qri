const crypto = require("crypto");
const QRI = require("./index");

// Generate keys synchronously
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: { type: "spki", format: "pem" },
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
});

async function generateAndValidateQRI() {
  try {
    // Generate QRI instance with private key for signing
    const qriInstance = await QRI.generate({ privateKey });
    const qriString = qriInstance.toString();

    console.log(`Generated QRI: ${qriString}`);

    // Parse the QRI string back into an object
    const parsedQRI = QRI.parse(qriString);

    // Validate the signature using the public key
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
