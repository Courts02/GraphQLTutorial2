import React from 'react';

import './EventItem.css';

// EventItem component represents a single event in a list
const eventItem = props => (
  // Each list item represents one event
  <li key={props.eventId} className="events__list-item">
    <div>
      {/* Event title */}
      <h1>{props.title}</h1>
      {/* Event price and formatted date */}
      <h2>
        ${props.price} - {new Date(props.date).toLocaleDateString()}
      </h2>
    </div>
    <div>
      {/* Conditional rendering based on whether current user owns the event */}
      {props.userId === props.creatorId ? (
        // Show owner message if user is the creator
        <p>Your the owner of this event.</p>
      ) : (
        // Show "View Details" button if user is not the creator
        <button className="btn" onClick={props.onDetail.bind(this, props.eventId)}>
          View Details
        </button>
      )}
    </div>
  </li>
);

export default eventItem;
