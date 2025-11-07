import app from './app.js';
import mongoose from 'mongoose';

mongoose.connect('mongodb://127.0.0.1:27017/Birthdays', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(5000, () => console.log('🚀 Server running on http://localhost:5000'));
})
.catch(err => console.error('MongoDB connection error:', err));
