import React from 'react';
import './BookingList.css';

// Functional component to display a list of bookings
const BookingList = props => (
  <ul className="bookings__list">
    {props.bookings.map(booking => {
      // Safely get event title or fallback if missing
      const eventTitle = booking.event && booking.event.title ? booking.event.title : 'Untitled Event';
      // Format the booking creation date or fallback if missing
      const date = booking.createdAt
        ? new Date(booking.createdAt).toLocaleDateString()
        : 'Unknown Date';

      return (
        <li key={booking._id} className="bookings__item">
          <div className="bookings__item-data">
            {/* Show event title and booking date */}
            {eventTitle} – {date}
          </div>
          <div className="bookings__item-actions">
            {/* Button triggers deletion of the booking by calling parent handler */}
            <button className="btn" onClick={() => props.onDelete(booking._id)}>
              Cancel
            </button>
          </div>
        </li>
      );
    })}
  </ul>
);

export default BookingList;
