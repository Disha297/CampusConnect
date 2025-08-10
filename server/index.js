require('dotenv').config();
const express = require('express');
const port= process.env.PORT || 5000
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const registerRoutes = require('./routes/register');

// This is still important for local testing, but you should also
// set the CORS origin in your Vercel project's environment variables
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.use('/api/register', registerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

const eventRegistrationsRoute = require('./routes/eventRegistrations');
app.use('/api', eventRegistrationsRoute);

// Connect to MongoDB. In a serverless environment, this will happen on each
// function cold start.
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    // Log for debugging, but the server won't listen here.
    console.log('MongoDB connected');
  })
  .catch(err => console.error('MongoDB connection error:', err));

// *** THE app.listen() CALL HAS BEEN REMOVED ***
// Instead of listening, you just export the app instance.
// Vercel handles the server startup and port listening for you.
module.exports = app;

  

