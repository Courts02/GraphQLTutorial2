import React from 'react';

import './BookingsControls.css';

// Functional component to switch between 'list' and 'chart' views of bookings
const BookingsControls = (props) => {
  return (
    <div className="bookings-control">
      {/* Button for List view */}
      <button
        // Add 'active' class if the current outputType is 'list'
        className={props.activeOutputType === 'list' ? 'active' : ''}
        // When clicked, notify parent to switch output to 'list'
        onClick={() => props.onChange('list')}
      >
        List
      </button>

      {/* Button for Chart view */}
      <button
        // Add 'active' class if the current outputType is 'chart'
        className={props.activeOutputType === 'chart' ? 'active' : ''}
        // When clicked, notify parent to switch output to 'chart'
        onClick={() => props.onChange('chart')}
      >
        Chart
      </button>
    </div>
  );
};

export default BookingsControls;
