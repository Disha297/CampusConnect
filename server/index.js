require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const registerRoutes = require('./routes/register');
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/api/register', registerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

const eventRegistrationsRoute = require('./routes/eventRegistrations');
app.use('/api', eventRegistrationsRoute);


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(5000, () => console.log('Server running on port 5000'));
  })
  .catch(err => console.error('MongoDB connection error:', err));
  

