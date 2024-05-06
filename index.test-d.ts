import { expectType, expectError, expectAssignable } from "tsd";
import QRI from "./index";

// Test constructor and property types
const qri = new QRI(
  "20210101120000",
  "abcd1234abcd",
  "12345678abcdef",
  "signature123456"
);
expectType<string>(qri.timestamp);
expectType<string>(qri.randomSegment);
expectType<string>(qri.checksum);
expectType<string | null>(qri.signature);

// Test static methods
(async () => {
  const generatedQRI = await QRI.generate();
  expectType<QRI>(generatedQRI);

  const parsedQRI = QRI.parse(
    "QRIv1-20210101120000-abcd1234abcd-12345678abcdef-signature123456"
  );
  expectType<QRI>(parsedQRI);

  const isValid = QRI.isValid(parsedQRI);
  expectType<boolean>(isValid);

  // This should fail because validateSignature requires a public key
  expectError(QRI.validateSignature(parsedQRI));

  // Correct usage with public key
  const publicKey = "public_key_string";
  const isValidSignature = QRI.validateSignature(parsedQRI, publicKey);
  expectType<boolean>(isValidSignature);
})();

// Test the generate method with options
(async () => {
  const privateKey = "private_key_string";
  const qriWithSignature = await QRI.generate({ privateKey });
  expectAssignable<QRI>(qriWithSignature);
  expectType<string>(qriWithSignature.signature);
})();
