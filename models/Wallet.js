import mongoose from 'mongoose';
import Counter from './Counter.js';

const walletSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    sparse: true, // Allow multiple null values
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
});

// Pre-save middleware to auto-generate userId
walletSchema.pre('save', async function(next) {
  if (this.isNew && !this.userId) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        'userId',
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.userId = String(counter.seq);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Post-save middleware to ensure userId is set
walletSchema.post('save', function(doc) {
  if (!doc.userId) {
    throw new Error('userId was not generated');
  }
});

const Wallet = mongoose.model('Wallet', walletSchema);

export default Wallet; 