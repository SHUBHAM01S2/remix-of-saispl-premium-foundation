// Server-only AES-256-GCM helpers for encrypting client-submitted access
// credentials at rest. The key is derived from CLIENT_CREDS_ENC_KEY (server
// env). Never import this file from client code — filename ends in
// `.server.ts` so the client bundler will refuse to include it.
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

export type EncryptedCreds = {
  v: 1;
  iv: string; // base64
  ct: string; // base64 ciphertext
  tag: string; // base64 GCM auth tag
};

function key(): Buffer {
  const raw = process.env.CLIENT_CREDS_ENC_KEY;
  if (!raw) throw new Error("CLIENT_CREDS_ENC_KEY is not configured");
  // Accept any length secret and derive a 32-byte key via SHA-256.
  return createHash("sha256").update(raw, "utf8").digest();
}

export function encryptCreds(plaintext: string): EncryptedCreds {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const ct = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    v: 1,
    iv: iv.toString("base64"),
    ct: ct.toString("base64"),
    tag: tag.toString("base64"),
  };
}

export function decryptCreds(payload: EncryptedCreds): string {
  if (!payload || payload.v !== 1) throw new Error("Unsupported ciphertext version");
  const iv = Buffer.from(payload.iv, "base64");
  const ct = Buffer.from(payload.ct, "base64");
  const tag = Buffer.from(payload.tag, "base64");
  const decipher = createDecipheriv("aes-256-gcm", key(), iv);
  decipher.setAuthTag(tag);
  const pt = Buffer.concat([decipher.update(ct), decipher.final()]);
  return pt.toString("utf8");
}

export function isEncrypted(value: unknown): value is EncryptedCreds {
  return (
    !!value &&
    typeof value === "object" &&
    (value as any).v === 1 &&
    typeof (value as any).iv === "string" &&
    typeof (value as any).ct === "string" &&
    typeof (value as any).tag === "string"
  );
}
