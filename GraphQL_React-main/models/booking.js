// ✅ Import mongoose
const mongoose = require('mongoose');

// ✅ Create a shorthand for mongoose.Schema
const Schema = mongoose.Schema;

// ✅ Define the Booking schema
const bookingSchema = new Schema(
  {
    // ✅ Each booking links to a specific Event
    event: {
      type: Schema.Types.ObjectId, // Store the Event's ID
      ref: 'Event' // Tell Mongoose this ObjectId refers to the 'Event' collection
    },
    // ✅ Each booking links to the User who booked it
    user: {
      type: Schema.Types.ObjectId, // Store the User's ID
      ref: 'User' // Refers to the 'User' collection
    }
  },
  {
    // ✅ Add automatic `createdAt` and `updatedAt` timestamps
    timestamps: true
  }
);

// ✅ Export the model so you can use it in your resolvers
module.exports = mongoose.model('Booking', bookingSchema);
