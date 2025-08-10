const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/authMiddleware');
const EventRegistration = require('../models/EventRegistration');

router.post('/:eventId', requireAuth, async (req, res) => {
  try {
    const existing = await EventRegistration.findOne({
      eventId: req.params.eventId,
      userId: req.user.userId
    });

    if (existing) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    const registration = new EventRegistration({
      eventId: req.params.eventId,
      userId: req.user.userId
    });

    await registration.save();
    res.status(201).json({ message: 'Registered successfully' });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register' });
  }
});

module.exports = router;
