// ✅ Import DataLoader to batch and cache DB requests
const DataLoader = require('dataloader');

// ✅ Import Mongoose models
const Event = require('../../models/event');
const User = require('../../models/user');

// ✅ Helper to convert Date objects to strings
const { dateToString } = require('../../helpers/date');

// ✅ Create an Event DataLoader instance
// This batches & caches requests for multiple event IDs
const eventLoader = new DataLoader(eventIds => {
  return events(eventIds); // Calls the helper below
});

// ✅ Create a User DataLoader instance
// This batches & caches requests for multiple user IDs
const userLoader = new DataLoader(userIds => {
  return User.find({ _id: { $in: userIds } });
});

// ✅ Helper function to fetch multiple events by IDs
const events = async eventIds => {
  try {
    // Find all events whose _id is in the eventIds array
    const events = await Event.find({ _id: { $in: eventIds } });

    // Sort them so the order matches the request order
    events.sort((a, b) => {
      return (
        eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString())
      );
    });

    // Transform each event for the response
    return events.map(event => {
      return transformEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

// ✅ Helper to fetch a single event by ID
// Uses the DataLoader to batch/cached loads
const singleEvent = async eventId => {
  try {
    const event = await eventLoader.load(eventId.toString());
    return event;
  } catch (err) {
    throw err;
  }
};

// ✅ Helper to fetch a single user by ID
// Uses the DataLoader to batch/cached loads
const user = async userId => {
  try {
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      _id: user.id,
      // When client requests createdEvents, it resolves them using the Event loader
      createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)
    };
  } catch (err) {
    throw err;
  }
};

// ✅ Transform an Event object for GraphQL response
const transformEvent = event => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    // When client requests `creator` field, it resolves using the helper above
    creator: user.bind(this, event.creator)
  };
};

// ✅ Transform a Booking object for GraphQL response
const transformBooking = booking => {
  return {
    ...booking._doc,
    _id: booking.id,
    // When client requests `user` or `event`, resolve them with loaders/helpers
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
  };
};

// ✅ Export the transformers
exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;

// ✅ You can also export raw helpers if needed
// exports.user = user;
// exports.events = events;
// exports.singleEvent = singleEvent;
