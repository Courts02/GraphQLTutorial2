import React from 'react';

import EventItem from './EventItem/EventItem';
import './EventList.css';

// EventList component takes in an array of events and renders a list of EventItem components
const eventList = props => {
  // Map over the array of events to create an array of EventItem components
  const events = props.events.map(event => {
    return (
      <EventItem
        key={event._id}               // Unique key for React list rendering
        eventId={event._id}           // Pass event ID to EventItem
        title={event.title}           // Event title
        price={event.price}           // Event price
        date={event.date}             // Event date
        userId={props.authUserId}     // Current logged-in user's ID for ownership check
        creatorId={event.creator._id} // Event creator's user ID to compare ownership
        onDetail={props.onViewDetail} // Function to handle viewing event details
      />
    );
  });

  // Render the list of EventItems inside a <ul> with styling
  return <ul className="event__list">{events}</ul>;
};

export default eventList;
