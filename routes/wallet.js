import express from 'express';
import Wallet from '../models/Wallet.js';

const router = express.Router();

// GET /api/wallet/update?userId=1&balance=50
router.get('/update', async (req, res) => {
  const { userId, balance } = req.query;
  if (!userId || isNaN(Number(balance))) {
    return res.status(400).json({ error: 'Missing or invalid userId or balance' });
  }

  const balanceChange = Number(balance);

  try {
    // Find and update existing wallet only
    const updatedWallet = await Wallet.findOneAndUpdate(
      { userId: String(userId) },
      { $inc: { balance: balanceChange } },
      {
        new: true,
      }
    );

    // If no wallet found, return error
    if (!updatedWallet) {
      return res.status(404).json({ error: 'Wallet not found for this user' });
    }

    // If balance is negative, revert and return error
    if (updatedWallet.balance < 0) {
      // Revert the update
      await Wallet.updateOne(
        { userId: String(userId) },
        { $inc: { balance: -balanceChange } }
      );
      return res.status(400).json({ error: 'Balance cannot be negative' });
    }

    return res.json({ userId, balance: updatedWallet.balance });
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
});

export default router; 