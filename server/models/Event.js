const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  title: String,
  description: String,
  location: String,
  date: Date,
  imageUrl: {
    type: String,
    default: 'https://placehold.co/600x400/E5E7EB/9CA3AF?text=No+Image', 
  },  
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
});

module.exports = mongoose.model('Event', eventSchema);


