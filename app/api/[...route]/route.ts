import { Context, Hono } from 'hono'
import { handle } from 'hono/vercel'

// export const runtime = 'edge'

const app = new Hono().basePath('/api')


// Private key as a string (ensure this is kept secure and not exposed publicly)
const privateKeyPEM = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC2yFqdakjY9S8O
b2Kzyf0M7/Jv31UBAXvtupyENyqJNZVIvzWgL98k5W3dvaBfxnRc2/f0/8b7H9NV
so3u3sa1+Fa1mexsA4mbD7D8xoL5jO/04fuFWjZDEg9vrQCXGz85sUBHOsKdacNS
Thwwza4TTqKmR9mNrfaORoz1be4zr03BohAeyzlLJgMk9j+k83FgvwvrUVSpW239
6L6LdErO8hZGCpAmOhSe0H4o3GwGCvYcSxoKS6vvjf2hr/hmbUVAo3uLkN6IJ/iK
Ys6zBdVYCfQHgUv0uW8bQFBeSbp5yENTp3snIYqDsyiwoM5CkW5RvhSpQ+EFzcf8
FLyaY/0pAgMBAAECggEAWl7b4nmCs/YhgmcS62ZiPUvDV4mZmwozTjoWGY628qjx
+spDBsS0dKcUt24ChWf271R4l4MAy/eTwwqpfyFZKO40XMxSJqNnHSnYbVnutth2
aWJzu557NpUO2b21DYDUtT8MU0tbnn2Eq0RgTsbamsQlycW7a//HZ9e86Lml7JoY
6kTMstSMIjLcIDXQcmdmizc82DskIhnKZ1bk0XywUW7kqk/ytVrL0CfcBNj/QJ0P
N+tURQcd1df8FRvufYktsdekVwV1Qwj9ZaNHyOPRLrgMuFwDVwPlugtervklKq5O
nlSx8MtgJXbiQnBOsd4ifNv/zfMrtxWK7d4N/DLYUwKBgQDqJYOu6EIbNXb6u65a
lirHALHrAZNiFwe2V5HjrZYKjOX5iywuNoC49ILsLfyBp+nIviG6xjI3Wo8C3P9v
w22tHTTu62T6FdL6DDEnvmQj9baz6phF7ewXdC74b3Y6gXNRTWvPajvkTfJydbW0
FupJDm/0zlULurXfhOjr2wnsrwKBgQDH15jJz/S2ZBj0N3nMPXtQm31KEE8aVF70
u3+uIFoUPBiyeAhOm+4T3mLyrJFHoDQ6GY9jMJb5RPXMs/a+7RXPHFywQpkZuHfC
58nRnhxut+Qd5WMC9f3dugdKxpHkWU7pMb5JKW/zPglOEdiwUxAFBD0Q0RfI5jFF
3g6iuGqZpwKBgH6W2aLunw7m0PSuE42WMnp0vbw4ld4qZVkH7zAQ4VXC53MK80/o
158nUsEt+559kb+eS84W6X9Tzo3VvaRHHDzD1aJ2UZmDwxS9ErZSEQIADk8nPjxQ
bZwgjGR0no7y/c2u9eKlpMvB+Jo5WYuL+A6XZ6ALDZ/RyhKWYPdi7PKxAoGAZBcf
dzSopBFOTkLaxeilMqIuBkJU3CMVzA18zYF2nFvdIsXrozOF8n2XoWO8/9rFTbQv
lMZpVz+qvHQGSWoFWk4iPkWc2L0DfqMI+evu4aVIo5CYHouGMt9Rd6ost+njE/jO
DWaro3CWyHs3xFhV1a1hyGJxPzXLx+qH+gfTnFECgYEApRKp+pWshwBdirIqOZj1
S+66M+TPh9pDn+ayMDWDD+KEMONc6hJOA2bMvYCmVN78TwdL9FJLor5XOZKIU8Ie
CKP7Yg3dWW30yRHrGOMAAcSMAAqCTg6s+3x5+UsoYyvPrcmbCq8LIzMnedLJZ/+t
1UGvnaN7ZcZby/YYsUBYPh8=
-----END PRIVATE KEY-----
`;


app.get("/", (c) => {
  return c.json({
    message: "server is running...🚀",
  });
});

app.post('/decrypt-data', async (c: Context) => {
  try {
    const { data } = await c.req.json();

    // Decrypt the data
    const decryptedData = await decryptData(data, privateKeyPEM);

    console.log('Decrypted Data:', decryptedData);

    // Send response
    return c.json({ message: 'Data received and decrypted successfully.' });
  } catch (error) {
    console.error('Decryption error:', error);
    return c.json({ message: 'Error decrypting data.' }, 500);
  }
});

async function decryptData(encryptedBase64: string, privateKeyPEM: string): Promise<string> {
  // Convert PEM to CryptoKey
  const privateKey = await crypto.subtle.importKey(
    'pkcs8',
    pemToArrayBuffer(privateKeyPEM),
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    false,
    ['decrypt']
  );

  // Convert encrypted data from Base64 to ArrayBuffer
  const encryptedArrayBuffer = base64ToArrayBuffer(encryptedBase64);

  // Decrypt the data
  const decryptedArrayBuffer = await crypto.subtle.decrypt(
    {
      name: 'RSA-OAEP',
    },
    privateKey,
    encryptedArrayBuffer
  );

  // Decode the decrypted data
  const decoder = new TextDecoder();
  return decoder.decode(decryptedArrayBuffer);
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  // Remove the PEM header and footer
  const b64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s/g, '');
  return base64ToArrayBuffer(b64);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}


export const GET = handle(app)
export const POST = handle(app)
