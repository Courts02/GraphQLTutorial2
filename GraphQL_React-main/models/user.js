// ✅ Import mongoose to define the schema
const mongoose = require('mongoose');

// ✅ Create a shorthand for Schema
const Schema = mongoose.Schema;

// ✅ Define the User schema
const userSchema = new Schema({
  // ✅ User's email (must be provided)
  email: {
    type: String,
    required: true
  },
  // ✅ User's hashed password (must be provided)
  password: {
    type: String,
    required: true
  },
  // ✅ Stores an array of Events this user created
  createdEvents: [
    {
      type: Schema.Types.ObjectId, // Stores Event IDs
      ref: 'Event' // Refers to the Event collection
    }
  ]
});

// ✅ Export the User model for use in your resolvers
module.exports = mongoose.model('User', userSchema);
