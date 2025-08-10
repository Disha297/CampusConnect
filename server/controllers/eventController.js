const Event = require('../models/Event');
const { validationResult } = require('express-validator');

exports.createEvent = async (req, res) => {
  try {
    const { title, description, location, date } = req.body;

    const event = new Event({
      title,
      description,
      location,
      date,
      creator: req.user.userId,
    });

    await event.save();
    res.status(201).json({ message: 'Event created', event });
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ error: 'Event creation failed' });
  }
};
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('creator', 'email'); 
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ creator: req.user.userId }); 
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch your events' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.creator.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await EventRegistration.deleteMany({ eventId: req.params.id });

    await event.deleteOne();

    res.status(200).json({ message: 'Event and all associated registrations deleted successfully' });
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, location, date, imageUrl } = req.body;
  const eventFields = { title, description, location, date, imageUrl };

  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    const userIdFromToken = req.user.userId;
    const eventCreatorId = event.creator.toString();

    if (eventCreatorId !== userIdFromToken) { 
      return res.status(403).json({ message: 'You are not authorized to update this event' });
    }

    event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: eventFields },
      { new: true }
    );
    
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

