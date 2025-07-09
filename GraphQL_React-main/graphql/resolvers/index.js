// ✅ Import all your individual resolver files
const authResolver = require('./auth');
const eventsResolver = require('./events');
const bookingResolver = require('./booking');

// ✅ Combine all resolvers into a single root resolver
const rootResolver = {
  ...authResolver,   // Handles auth: createUser, login
  ...eventsResolver, // Handles events: events (query), createEvent (mutation)
  ...bookingResolver // Handles bookings: bookings (query), bookEvent, cancelBooking (mutations)
};

// ✅ Export the combined root resolver for your GraphQL server
module.exports = rootResolver;
