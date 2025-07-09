// ✅ Import mongoose to define your schema
const mongoose = require('mongoose');

// ✅ Shortcut for mongoose.Schema
const Schema = mongoose.Schema;

// ✅ Define the Event schema
const eventSchema = new Schema({
  // ✅ Title of the event (required)
  title: {
    type: String,
    required: true
  },
  // ✅ Description of the event (required)
  description: {
    type: String,
    required: true
  },
  // ✅ Price of the event (required)
  price: {
    type: Number,
    required: true
  },
  // ✅ Date/time of the event (required)
  date: {
    type: Date,
    required: true
  },
  // ✅ Reference to the User who created the event
  creator: {
    type: Schema.Types.ObjectId, // Stores the creator's User ID
    ref: 'User' // This links to the 'User' collection so you can populate
  }
});

// ✅ Export the model so you can use it in your resolvers
module.exports = mongoose.model('Event', eventSchema);
