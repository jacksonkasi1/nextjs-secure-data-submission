import { Hono } from "hono";
import { handle } from "hono/vercel";

import crypto from "crypto";
import fs from "fs";
import path from "path";

const app = new Hono().basePath("/api");

// Load the private key
const privateKeyPath = path.resolve(__dirname, "private_key.pem");
const privateKey = fs.readFileSync(privateKeyPath, "utf8");

// Root endpoint
app.get("/", (c) => {
  return c.json({
    message: "server is running...🚀",
  });
});

// Decrypt data endpoint

app.post('/decrypt-data', async (c) => {
  try {
    const { data } = await c.req.json();

    // Decrypt the data
    const decryptedData = decryptData(data, privateKey);

    console.log('Decrypted Data:', decryptedData);

    // Send response
    return c.json({ message: 'Data received and decrypted successfully.' });
  } catch (error) {
    console.error('Decryption error:', error);
    return c.json({ message: 'Error decrypting data.' }, 500);
  }
});

function decryptData(encryptedBase64, privateKey) {
  // Convert Base64 to Buffer
  const encryptedBuffer = Buffer.from(encryptedBase64, 'base64');

  // Decrypt the data
  const decryptedBuffer = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    encryptedBuffer
  );

  return decryptedBuffer.toString('utf8');
}

export const GET = handle(app);
export const POST = handle(app);
