// Import your Mongoose Event and Booking models
const Event = require('../../models/event');
const Booking = require('../../models/booking');

// Import helper functions to transform DB objects for the client
const { transformBooking, transformEvent } = require('./merge');

module.exports = {
  //  This is a **GraphQL Query Resolver**
  // It **fetches** all bookings for the authenticated user
  bookings: async (args, context) => {
    const req = context.req;
    // Check if the user is authenticated
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      // Find all bookings linked to the authenticated user
      const bookings = await Booking.find({ user: req.userId });

      // Transform each booking for the response
      return bookings.map(booking => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },

  // ✅ This is a **GraphQL Mutation Resolver**
  // It **creates** a booking (adds new data)
  bookEvent: async (args, context) => {
    const req = context.req;
    // Check authentication
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }

    // Find the event to book
    const fetchedEvent = await Event.findOne({ _id: args.eventId });

    // Create a new booking linking the user and the event
    const booking = new Booking({
      user: req.userId,
      event: fetchedEvent
    });

    // Save the new booking to the database (the mutation happens here)
    const result = await booking.save();

    // Transform and return the saved booking
    return transformBooking(result);
  },

  // ✅ This is a **GraphQL Mutation Resolver**
  // It **deletes** a booking (removes data)
  cancelBooking: async (args, context) => {
    const req = context.req;
    // Check authentication
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      // Find the booking by ID and populate its event
      const booking = await Booking.findById(args.bookingId).populate('event');

      // Prepare the event to return as the response
      const event = transformEvent(booking.event);

      // Delete the booking from the database (the mutation happens here)
      await Booking.deleteOne({ _id: args.bookingId });

      // Return the event data
      return event;
    } catch (err) {
      throw err;
    }
  }
};
