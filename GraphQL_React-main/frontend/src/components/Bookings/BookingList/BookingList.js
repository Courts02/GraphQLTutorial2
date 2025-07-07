import React from 'react';
import './BookingList.css';

const BookingList = props => (
  <ul className="bookings__list">
    {props.bookings.map(booking => {
      const eventTitle = booking.event && booking.event.title ? booking.event.title : 'Untitled Event';
      const date = booking.createdAt
        ? new Date(booking.createdAt).toLocaleDateString()
        : 'Unknown Date';

      return (
        <li key={booking._id} className="bookings__item">
          <div className="bookings__item-data">
            {eventTitle} – {date}
          </div>
          <div className="bookings__item-actions">
            <button className="btn" onClick={() => props.onDelete(booking._id)}>Cancel</button>
          </div>
        </li>
      );
    })}
  </ul>
);

export default BookingList;
