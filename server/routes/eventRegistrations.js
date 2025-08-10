console.log('Event registration routes loaded');
const express = require('express');
const router = express.Router(); 
const requireAuth = require('../middleware/authMiddleware');
const EventRegistration = require('../models/EventRegistration');


router.get('/my-registrations', requireAuth, async (req, res) => {
  try {
    const registrations = await EventRegistration.find({ userId: req.user.userId })
      .populate('eventId'); 

    const registeredEvents = registrations.map(reg => reg.eventId);

    res.status(200).json(registeredEvents);
  } catch (err) {
    console.error('Fetching registrations error:', err);
    res.status(500).json({ error: 'Failed to fetch your registered events' });
  }
});

module.exports = router;
