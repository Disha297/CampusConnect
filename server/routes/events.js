const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator'); 
const authMiddleware = require('../middleware/authMiddleware');
const eventController = require('../controllers/eventController');

router.get('/', eventController.getAllEvents);

router.post(
  '/',
  [
    authMiddleware,
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('date', 'Date is required').not().isEmpty(),
  ],
  eventController.createEvent
);

router.put(
  '/:id',
  [
    authMiddleware,
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('location', 'Location is required').not().isEmpty(), 
    check('date', 'Date is required').not().isEmpty(),
  ],
  eventController.updateEvent 
);

router.get('/myevents', authMiddleware, eventController.getMyEvents);
router.delete('/:id', authMiddleware, eventController.deleteEvent);

module.exports = router;


