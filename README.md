# Next.js Secure Data Submission

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A Next.js application demonstrating client-side encryption and server-side decryption using RSA keys. The project ensures secure data transmission by encrypting user input on the client side before sending it to the backend, where it is decrypted securely.

**Repository Link:** [https://github.com/jacksonkasi1/nextjs-secure-data-submission](https://github.com/jacksonkasi1/nextjs-secure-data-submission)

---

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Generating RSA Key Pair](#generating-rsa-key-pair)
- [How to Use](#how-to-use)
- [Limitations](#limitations)
- [License](#license)

---

## Introduction

This project showcases how to implement client-side encryption and server-side decryption in a Next.js application using TypeScript. By encrypting sensitive data on the client side using the RSA public key and decrypting it on the server side using the RSA private key, we ensure that sensitive information remains confidential during transmission.

---

## Features

- **Client-Side Encryption**: Encrypt user input data using the RSA public key with the Web Crypto API.
- **Server-Side Decryption**: Decrypt received data using the RSA private key on the backend.
- **Data Transmission Security**: Protect sensitive information during network transmission.
- **TypeScript Implementation**: Benefit from TypeScript's static typing and IntelliSense.
- **User-Friendly Interface**: Simple UI for users to input data and see encrypted/decrypted messages.

---

## Prerequisites

- **Node.js** v14 or higher
- **npm** v6 or higher
- **OpenSSL** (for generating RSA key pairs)
- **Git** (for cloning the repository)

---

## Getting Started

1. **Clone the Repository**

   ```bash
   git clone https://github.com/jacksonkasi1/nextjs-secure-data-submission.git
   cd nextjs-secure-data-submission
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Generate RSA Key Pair**

   See [Generating RSA Key Pair](#generating-rsa-key-pair) for instructions.

4. **Configure the Application**

   - Place your RSA keys in the appropriate files.
   - Update the frontend and backend code with your RSA key contents.

5. **Run the Development Server**

   ```bash
   npm run dev
   ```

6. **Access the Application**

   Open your browser and navigate to `http://localhost:3000`.

---

## Generating RSA Key Pair

To implement RSA encryption and decryption, you need to generate a public and private key pair. Follow the steps below:

### **1. Install OpenSSL**

If you don't have OpenSSL installed, download it from [OpenSSL Official Website](https://www.openssl.org/) or install it via your package manager.

### **2. Generate the Private Key**

Open your terminal and run:

```bash
openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048
```

- This command generates a 2048-bit RSA private key and saves it to `private_key.pem`.

### **3. Generate the Public Key**

Run the following command to extract the public key:

```bash
openssl rsa -pubout -in private_key.pem -out public_key.pem
```

- This reads the private key and outputs the corresponding public key to `public_key.pem`.

### **4. Secure Your Keys**

- **private_key.pem**: This is sensitive and should **never** be exposed publicly or committed to version control. Store it securely on your server or use environment variables.
- **public_key.pem**: This can be shared publicly and will be included in your frontend code.

### **5. Update the Project Files**

- **Backend** (`pages/api/decrypt-data.ts`):

  - Replace `YOUR_PRIVATE_KEY_CONTENT_HERE` with the contents of `private_key.pem`.

- **Frontend** (`pages/index.tsx` or `app/page.tsx`):

  - Replace `YOUR_PUBLIC_KEY_CONTENT_HERE` with the contents of `public_key.pem`.

---

## How to Use

### **1. Start the Development Server**

```bash
npm run dev
```

### **2. Open the Application in Your Browser**

Navigate to `http://localhost:3000`.

### **3. Submit Data**

- Enter some text in the input field labeled "Enter sensitive data".
- Click the "Submit Securely" button.

### **4. View the Results**

- **Encrypted Data**: After submission, the encrypted version of your input will be displayed.
- **API Response Data**: The response from the backend API will be displayed, showing whether the data was received and decrypted successfully.

### **5. Check Server Logs**

- The decrypted data is logged on the server console for demonstration purposes.
- **Note**: In a production environment, avoid logging sensitive data.

---

## Limitations

- **Not Suitable for Large Data**: RSA encryption is not designed for large amounts of data. This example works with small strings. For larger data, consider using hybrid encryption (e.g., encrypt data with AES and then encrypt the AES key with RSA).
- **Security Considerations**:

  - **Decrypted Data Exposure**: Sending decrypted data back to the client or logging it is insecure. In this example, decrypted data is displayed for demonstration purposes only.
  - **Key Management**: Storing private keys in source code is insecure. Use environment variables or a secrets manager in production.
  - **HTTPS Requirement**: Always serve the application over HTTPS to prevent man-in-the-middle attacks.

- **Edge Runtime Limitations**:

  - If using the Edge Runtime in Next.js, some Node.js modules (like `crypto`) may not be fully supported. This example uses the Node.js runtime for full compatibility.

- **Browser Compatibility**:

  - The Web Crypto API is supported in modern browsers. Users with outdated browsers may experience issues.

- **Error Handling**:

  - The application includes basic error handling. Additional checks and validations should be implemented for production use.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgements

- **Next.js**: [https://nextjs.org/](https://nextjs.org/)
- **Hono.js**: [https://hono.dev/](https://hono.dev/)
- **OpenSSL**: [https://www.openssl.org/](https://www.openssl.org/)

---

## Contact

For any questions or suggestions, please open an issue on the GitHub repository or contact the project maintainer.

---

**Disclaimer**: This project is intended for educational purposes to demonstrate client-side encryption and server-side decryption in a web application. It should not be used as-is in production environments without proper security assessments and modifications.