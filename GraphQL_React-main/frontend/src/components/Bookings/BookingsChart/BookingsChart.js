import React from 'react';
import { Bar } from 'react-chartjs-2';

const BookingsChart = ({ bookings }) => {
  // Extract event prices from bookings, defaulting to 0 if missing
  const prices = bookings.map(booking =>
    booking.event && booking.event.price ? booking.event.price : 0
  );

  // Generate labels as Booking #1, #2, etc.
  const labels = bookings.map((_, index) => `#${index + 1}`);

  // Chart.js data configuration
  const data = {
    labels: labels, // X-axis labels
    datasets: [
      {
        label: 'Event Price', // Legend label for the dataset
        backgroundColor: 'rgba(153,102,255,0.6)', // Bar fill color
        borderColor: 'rgba(153,102,255,1)', // Bar border color
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(153,102,255,0.8)', // Hover fill color
        hoverBorderColor: 'rgba(153,102,255,1)', // Hover border color
        data: prices, // Y-axis values for each booking
      },
    ],
  };

  // Chart.js options for styling and axes configuration
  const options = {
    maintainAspectRatio: false, // Allows custom height
    scales: {
      y: {
        beginAtZero: true, // Start Y axis at 0
        title: {
          display: true,
          text: 'Price', // Label for Y axis
        },
      },
      x: {
        title: {
          display: true,
          text: 'Booking #', // Label for X axis
        },
      },
    },
  };

  // Render the Bar chart with data and options, height fixed to 300px
  return <Bar data={data} options={options} height={300} />;
};

export default BookingsChart;
