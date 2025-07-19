import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import QRCode from 'qrcode';
import connectDB from './db.js';
import walletRoutes from './routes/wallet.js';

const app = express();
const server = createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/wallet', walletRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Join payment room
  socket.on('join-payment', (data) => {
    socket.join(data.paymentId);
    console.log(`User ${socket.id} joined payment room: ${data.paymentId}`);
  });
  
  // Handle payment success
  socket.on('payment-success', (data) => {
    console.log('Payment success:', data);
    // Notify all clients in the payment room
    io.to(data.paymentId).emit('payment-success', data);
  });
  
  // Handle payment failure
  socket.on('payment-failed', (data) => {
    console.log('Payment failed:', data);
    io.to(data.paymentId).emit('payment-failed', data);
  });
  
  // Handle payment initiation
  socket.on('payment-initiated', (data) => {
    console.log('Payment initiated:', data);
    io.to(data.paymentId).emit('payment-initiated', data);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Serve checkout page
app.get('/checkout', (req, res) => {
  res.sendFile('checkout.html', { root: './public' });
});

// Serve mobile payment page
app.get('/mobile-pay', (req, res) => {
  res.sendFile('mobile-pay.html', { root: './public' });
});

// Generate QR code endpoint
app.get('/api/qr/:paymentId/:amount', async (req, res) => {
  try {
    const { paymentId, amount } = req.params;
    const paymentUrl = `${req.protocol}://${req.get('host')}/mobile-pay?paymentId=${paymentId}&amount=${amount}`;
    
    const qrCodeDataURL = await QRCode.toDataURL(paymentUrl, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    res.json({ qrCode: qrCodeDataURL, paymentUrl });
  } catch (error) {
    console.error('QR Code generation error:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// Serve demo page
app.get('/', (req, res) => {
  res.sendFile('demo.html', { root: './public' });
});

// Start server after DB connection
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Demo page: http://localhost:${PORT}/`);
    console.log(`Checkout page: http://localhost:${PORT}/checkout`);
    console.log(`Mobile payment: http://localhost:${PORT}/mobile-pay`);
  });
}); 