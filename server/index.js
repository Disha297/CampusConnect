require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const registerRoutes = require('./routes/register');

// Use an environment variable for the CORS origin.
const clientUrl = process.env.CLIENT_URL || 'https://localhost:5173';
app.use(cors({ origin: clientUrl, credentials: true }));

app.use(express.json());
app.use('/api/register', registerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

const eventRegistrationsRoute = require('./routes/eventRegistrations');
app.use('/api', eventRegistrationsRoute);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
