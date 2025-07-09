// Import your Mongoose Event and User models
const Event = require('../../models/event');
const User = require('../../models/user');

// Import helper to transform an Event document for the client
const { transformEvent } = require('./merge');

module.exports = {
  //  This is a **GraphQL Query Resolver**
  // It **fetches** all events from the database
  events: async () => {
    try {
      // Find all events
      const events = await Event.find();

      // Transform each event for the response
      return events.map(event => {
        return transformEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },

  // ✅ This is a **GraphQL Mutation Resolver**
  // It **creates** a new event (adds data)
  createEvent: async (args, context) => {
    const req = context.req;
    // Check if the user is authenticated
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }

    // Create a new Event instance with the input data
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price, // Ensure price is a number
      date: new Date(args.eventInput.date),
      creator: req.userId // Link the event to the logged-in user
    });

    let createdEvent; // To store the transformed result

    try {
      // Save the event to the database (this is the mutation!)
      const result = await event.save();

      // Transform the saved event for the response
      createdEvent = transformEvent(result);

      // Find the user who created the event
      const creator = await User.findById(req.userId);
      if (!creator) {
        throw new Error('User not found.');
      }

      // Add the event to the user's `createdEvents` list
      creator.createdEvents.push(event);
      await creator.save(); // Save the updated user (this is also a mutation!)

      // Return the transformed event
      return createdEvent;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};
