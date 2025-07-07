import React from 'react';
import { Bar } from 'react-chartjs-2';

const BookingsChart = ({ bookings }) => {
  // Extract prices from bookings safely
  const prices = bookings.map(function (booking) {
    return booking.event && booking.event.price ? booking.event.price : 0;
  });

  const labels = bookings.map(function (_, index) {
    return `#${index + 1}`;
  });

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Event Price',
        backgroundColor: 'rgba(153,102,255,0.6)',
        borderColor: 'rgba(153,102,255,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(153,102,255,0.8)',
        hoverBorderColor: 'rgba(153,102,255,1)',
        data: prices,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Price',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Booking #',
        },
      },
    },
  };

  return <Bar data={data} options={options} height={300} />;
};

export default BookingsChart;
