# Tenet Practical Wallet API

## 🚀 Install & Run

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Seed the database with test users:**
   ```bash
   npm run seed
   ```
   This will create 5 users with auto-incrementing user IDs and a default balance of 100.
3. **Start the server (development mode, with auto-reload):**
   ```bash
   npm run dev
   ```
   Or, to run in production mode:
   ```bash
   npm start
   ```

---

## Overview
This project provides a simple wallet API with balance update functionality, a seeder for test users, and a real-time QR code checkout demo using Socket.IO.

---

## API Documentation

### 1. Update Wallet Balance
**Endpoint:** `GET /api/wallet/update?userId=<userId>&balance=<amount>`

- **Description:** Atomically increases or decreases the balance for a given user.
- **Parameters:**
  - `userId` (string, required): The user ID (e.g., "1").
  - `balance` (number, required): The amount to add (positive) or subtract (negative).
- **Responses:**
  - `200 OK`: `{ userId, balance }` (updated balance)
  - `400 Bad Request`: `{ error: 'Balance cannot be negative' }` or invalid params
  - `404 Not Found`: `{ error: 'Wallet not found for this user' }`
  - `500 Server Error`: `{ error: 'Server error', details }`

**Example:**
```
GET /api/wallet/update?userId=1&balance=50
```

---

### 2. Generate QR Code (Server-side)
**Endpoint:** `GET /api/qr/:paymentId/:amount`

- **Description:** Generates a QR code (as a Data URL) for a payment link.
- **Parameters:**
  - `paymentId` (string, required): Unique payment identifier
  - `amount` (number, required): Payment amount
- **Response:**
  - `200 OK`: `{ qrCode: <data:image/png;base64...>, paymentUrl }`
  - `500 Server Error`: `{ error: 'Failed to generate QR code' }`

**Example:**
```
GET /api/qr/PAY-12345/99.99
```

---

## QR Payment & Checkout Demo

### ⚠️ IMPORTANT: Testing on Multiple Devices
If you want to test the QR code and payment flow between your desktop and a mobile device, **replace `localhost` in the URL with your local machine's IP address** (e.g., `192.168.1.10`).

- Example: `http://192.168.1.10:3000/checkout`
- Your mobile device must be on the same WiFi/network as your computer.
- This ensures the mobile device can access the server and scan the QR code successfully.

### 1. Start the Server
```
npm run dev
```

### 2. Open the Demo Page
- Visit: [http://localhost:3000/](http://localhost:3000/)
- This page links to both the checkout and mobile payment pages.

### 3. Test the Checkout Flow
- Open `/checkout` on your desktop: [http://localhost:3000/checkout](http://localhost:3000/checkout)
- A QR code will be displayed (generated server-side for reliability)
- Scan the QR code with your mobile device, or open the mobile link if on mobile

### 4. Complete Payment on Mobile
- The QR code/mobile link opens `/mobile-pay` with the payment ID and amount
- Click **Pay Now** to simulate payment
- The checkout page will update in real-time to show payment success

### 5. Troubleshooting
- If the QR code does not display, a payment link will be shown as a fallback
- Make sure the server is running and accessible from both devices
- Check browser console for errors if QR code is missing

---

## Seeder
- To seed test users in the wallet collection:
```
npm run seed
```
- This will create 5 users with auto-incrementing user IDs and a default balance of 100.

---

## JMeter Load Test
- See `JMETER_TEST_README.md` for instructions on running the JMeter load test for the wallet API.

---

## Project Structure
```
models/Wallet.js         # Wallet Mongoose model
models/Counter.js        # Counter for auto-increment userId
routes/wallet.js         # Wallet API routes
seeders/walletSeeder.js  # Seeder script
public/checkout.html     # Checkout page (QR code)
public/mobile-pay.html   # Mobile payment page
public/demo.html         # Demo overview page
index.js                 # Main server (Express + Socket.IO)
```

---

## Dependencies
- express
- mongoose
- socket.io
- qrcode
- dotenv 