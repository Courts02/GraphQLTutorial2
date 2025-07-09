import React from 'react';

import './Spinner.css';

// Spinner functional component that shows a loading spinner animation
const spinner = () => (
  <div className="spinner">
    {/* Inner div with class that triggers the spinning animation */}
    <div className="lds-dual-ring" />
  </div>
);

export default spinner;
