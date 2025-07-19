# Tenet Practical Wallet API

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Set up MongoDB:**
   - Default connection: `mongodb://localhost:27017/tenet-practical`
   - Or set `MONGODB_URI` in your environment variables.

3. **Run the server:**
   ```bash
   node index.js
   ```

## API Endpoint

### Update Wallet Balance

- **Endpoint:** `GET /api/wallet/update?userId=1&balance=50`
- **Description:** Increases or decreases the user's wallet balance atomically. Creates a new wallet if user does not exist.
- **Parameters:**
  - `userId` (String or Number): Unique user identifier
  - `balance` (Number): Amount to increment (positive) or decrement (negative)

#### Example Requests

- Increase balance by 50:
  ```
  GET /api/wallet/update?userId=1&balance=50
  ```
- Decrease balance by 30:
  ```
  GET /api/wallet/update?userId=1&balance=-30
  ```

#### Example Response
```json
{
  "userId": "1",
  "balance": 20
}
```

#### Error (e.g., negative balance)
```json
{
  "error": "Balance cannot be negative"
}
``` 