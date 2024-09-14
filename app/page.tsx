'use client'
import { useState, FormEvent } from 'react';

export default function Home() {
  const [inputData, setInputData] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  // Replace with the content of your public_key.pem
  const publicKeyPEM = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtshanWpI2PUvDm9is8n9
DO/yb99VAQF77bqchDcqiTWVSL81oC/fJOVt3b2gX8Z0XNv39P/G+x/TVbKN7t7G
tfhWtZnsbAOJmw+w/MaC+Yzv9OH7hVo2QxIPb60Alxs/ObFARzrCnWnDUk4cMM2u
E06ipkfZja32jkaM9W3uM69NwaIQHss5SyYDJPY/pPNxYL8L61FUqVtt/ei+i3RK
zvIWRgqQJjoUntB+KNxsBgr2HEsaCkur7439oa/4Zm1FQKN7i5DeiCf4imLOswXV
WAn0B4FL9LlvG0BQXkm6echDU6d7JyGKg7MosKDOQpFuUb4UqUPhBc3H/BS8mmP9
KQIDAQAB
-----END PUBLIC KEY-----
`;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Encrypt the data
      const encryptedData = await encryptData(inputData, publicKeyPEM);

      // Send encrypted data to the API route
      const response = await fetch('/api/decrypt-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: encryptedData }),
      });

      const result = await response.json();
      setResponseMessage(result.message);
    } catch (error) {
      console.error('Encryption error:', error);
      setResponseMessage('Encryption failed.');
    }
  };

  const encryptData = async (data: string, publicKeyPEM: string): Promise<string> => {
    // Convert PEM to ArrayBuffer
    const publicKey = await window.crypto.subtle.importKey(
      'spki',
      pemToArrayBuffer(publicKeyPEM),
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      false,
      ['encrypt']
    );

    // Encode the data as an ArrayBuffer
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);

    // Encrypt the data
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP',
      },
      publicKey,
      dataBuffer
    );

    // Convert encrypted data to Base64 string
    return bufferToBase64(encryptedBuffer);
  };

  const pemToArrayBuffer = (pem: string): ArrayBuffer => {
    // Remove the PEM header and footer
    const b64 = pem
      .replace(/-----BEGIN PUBLIC KEY-----/, '')
      .replace(/-----END PUBLIC KEY-----/, '')
      .replace(/\s/g, '');
    return base64ToArrayBuffer(b64);
  };

  const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  const bufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return window.btoa(binary);
  };

  return (
    <div>
      <h1>Secure Data Submission</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter sensitive data"
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          required
        />
        <button type="submit">Submit Securely</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
}
