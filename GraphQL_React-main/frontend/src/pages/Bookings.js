import React, { Component } from 'react';

// ✅ Spinner for loading state
import Spinner from '../components/Spinner/Spinner';
// ✅ Auth context to get JWT token
import AuthContext from '../context/auth-context';
// ✅ Components for displaying bookings in different ways
import BookingList from '../components/Bookings/BookingList/BookingList';
import BookingsChart from '../components/Bookings/BookingsChart/BookingsChart';
import BookingsControls from '../components/Bookings/BookingsControls/BookingsControls';

class BookingsPage extends Component {
  state = {
    isLoading: false,  // ✅ Controls spinner visibility
    bookings: [],      // ✅ Holds all bookings fetched
    outputType: 'list' // ✅ Switch between list and chart view
  };

  static contextType = AuthContext; // ✅ So we can access `token` anywhere

  componentDidMount() {
    // ✅ On page load, fetch all bookings
    this.fetchBookings();
  }

  // ✅ --- GRAPHQL QUERY ---
  // ✅ Fetch user's bookings
  fetchBookings = () => {
    this.setState({ isLoading: true });

    const requestBody = {
      query: `
        query {
          bookings {
            _id
            createdAt
            event {
              _id
              title
              date
              price
            }
          }
        }
      `
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token // ✅ Pass JWT for auth
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const bookings = resData.data.bookings;
        this.setState({ bookings: bookings, isLoading: false });
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  // ✅ --- GRAPHQL MUTATION ---
  // ✅ Runs when user clicks "Cancel" to remove a booking
  deleteBookingHandler = bookingId => {
    this.setState({ isLoading: true });

    const requestBody = {
      query: `
        mutation CancelBooking($id: ID!) {
          cancelBooking(bookingId: $id) {
            _id
            title
          }
        }
      `,
      variables: {
        id: bookingId // ✅ Pass the booking ID to cancel
      }
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token // ✅ JWT auth again!
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        // ✅ Remove the cancelled booking from local state
        this.setState(prevState => {
          const updatedBookings = prevState.bookings.filter(booking => {
            return booking._id !== bookingId;
          });
          return { bookings: updatedBookings, isLoading: false };
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  // ✅ Switch between list and chart
  changeOutputTypeHandler = outputType => {
    if (outputType === 'list') {
      this.setState({ outputType: 'list' });
    } else {
      this.setState({ outputType: 'chart' });
    }
  };

  render() {
    let content = <Spinner />;

    if (!this.state.isLoading) {
      content = (
        <React.Fragment>
          {/* ✅ Controls to switch views */}
          <BookingsControls
            activeOutputType={this.state.outputType}
            onChange={this.changeOutputTypeHandler}
          />

          <div>
            {this.state.outputType === 'list' ? (
              // ✅ List view of bookings with cancel button
              <BookingList
                bookings={this.state.bookings}
                onDelete={this.deleteBookingHandler} // ✅ Cancel = MUTATION!
              />
            ) : (
              // ✅ Chart view of bookings
              <BookingsChart bookings={this.state.bookings} />
            )}
          </div>
        </React.Fragment>
      );
    }

    return <React.Fragment>{content}</React.Fragment>;
  }
}

export default BookingsPage;
