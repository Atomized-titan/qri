const QRI = require("../index");

describe("Quantum-Resistant Identifier System", () => {
  test("QRI generation produces a valid instance without signature", async () => {
    const qri = QRI.generate();
    expect(qri).toBeDefined();
    expect(qri.toString()).toMatch(/^QRIv1-/);
    expect(qri.signature).toBe(""); // Expect no signature when not using a private key
  });

  test("QRI generation produces a valid instance with signature", async () => {
    const privateKey = QRI.privateKey; // Ensure this is correctly defined
    const qri = QRI.generate({ privateKey });
    expect(qri).toBeDefined();
    expect(qri.toString()).toMatch(/^QRIv1-/);
    expect(qri.signature).not.toBe(""); // Should have a signature
  });

  test("Simple QRID generation produces a valid instance", async () => {
    const id = QRI.qrid();
    const isValid = QRI.isValid(QRI.parse(id));
    expect(isValid).toBe(true);
  });

  test("QRI has correct segments", async () => {
    const qri = QRI.generate();
    const parts = qri.toString().split("-");
    expect(parts).toHaveLength(4); // No signature segment when no private key
    expect(parts[0]).toBe("QRIv1");
    expect(parts[1]).toHaveLength(17); // Check timestamp length
    expect(parts[2]).toHaveLength(32); // Check random segment length
    expect(parts[3]).toHaveLength(32); // Check checksum length
  });

  test("QRI validation confirms unaltered QRI", async () => {
    const qri = QRI.generate();
    const isValid = QRI.isValid(qri);
    expect(isValid).toBe(true);
  });

  test("QRI validation fails with altered data", async () => {
    const qri = QRI.generate();
    const qriStr = qri.toString();
    const alteredQriStr = qriStr.replace(
      qri.randomSegment,
      "12345678901234567890123456789012"
    );
    const isValid = QRI.isValid(QRI.parse(alteredQriStr));
    expect(isValid).toBe(false);
  });

  test("QRI encode and decode", async () => {
    const qri = QRI.generate();
    const parsedQri = QRI.parse(qri.toString());
    expect(qri.toString()).toEqual(parsedQri.toString());
    expect(QRI.isValid(parsedQri)).toBe(true);
  });

  test("QRI throws if called without valid data", () => {
    expect(() => {
      QRI.parse("invalid-qri-string");
    }).toThrow();
  });

  test("QRI properties are accessible and correct", async () => {
    const qri = QRI.generate();
    expect(typeof qri.timestamp).toBe("string");
    expect(qri.randomSegment).toHaveLength(32);
    expect(qri.checksum).toHaveLength(32);
    expect(qri.signature).toBe(""); // No signature expected without privateKey
  });

  test("QRI comparison works correctly", async () => {
    const qri1 = QRI.generate();
    const qri2 = QRI.generate();
    expect(qri1.toString()).not.toEqual(qri2.toString());
  });

  test("QRI without public key should still be valid if no signature required", async () => {
    const qri = QRI.generate();
    expect(QRI.isValid(qri)).toBe(true); // Valid without a signature
  });

  test("QRI with signature verification", async () => {
    const privateKey = QRI.privateKey; // Assume privateKey is defined in the module
    const publicKey = QRI.publicKey; // Assume publicKey is available
    const qri = QRI.generate({ privateKey });
    expect(QRI.isValid(qri, publicKey)).toBe(true); // Check with public key
  });
});
