import React, { Component } from 'react';
// ✅ Helpers for saving & loading localStorage
import { saveToLocalStorage, getFromLocalStorage } from '../utils/localStorage';

// ✅ UI components
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import EventList from '../components/Events/EventList/EventList';
import Spinner from '../components/Spinner/Spinner';

// ✅ Auth context to get token & userId
import AuthContext from '../context/auth-context';

import './Events.css';

class EventsPage extends Component {
  // ✅ Local state
  state = {
    creating: false,       // Controls if "Create Event" modal is open
    events: [],            // Loaded events list
    isLoading: false,      // Spinner toggle
    selectedEvent: null    // Currently selected event to book
  };

  isActive = true;         // Used to check if component is still mounted

  static contextType = AuthContext; // ✅ Hook up context for auth

  constructor(props) {
    super(props);
    // ✅ Create refs for form inputs
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  componentDidMount() {
    // ✅ Load cached events or fetch fresh from backend
    const storedEvents = getFromLocalStorage('events');
    if (storedEvents && storedEvents.length > 0) {
      this.setState({ events: storedEvents });
    } else {
      this.fetchEvents();
    }
  }

  // ✅ Open "Create Event" modal
  startCreateEventHandler = () => {
    this.setState({ creating: true });
  };

  // ✅ CONFIRM handler: runs when user clicks "Confirm" to create an event
  modalConfirmHandler = () => {
    this.setState({ creating: false });

    // ✅ Grab form values from refs
    const title = this.titleElRef.current.value;
    const price = +this.priceElRef.current.value;
    const date = this.dateElRef.current.value;
    const description = this.descriptionElRef.current.value;

    // ✅ Basic validation
    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    // ✅ --- THIS IS A MUTATION ---
    // ✅ Build GraphQL mutation to CREATE EVENT
    const requestBody = {
      query: `
        mutation CreateEvent($title: String!, $desc: String!, $price: Float!, $date: String!) {
          createEvent(eventInput: {title: $title, description: $desc, price: $price, date: $date}) {
            _id
            title
            description
            date
            price
          }
        }
      `,
      variables: {
        title,
        desc: description,
        price,
        date
      }
    };

    const token = this.context.token; // ✅ Get JWT from context

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token // ✅ Pass JWT for auth
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        // ✅ New event returned from mutation
        const newEvent = {
          _id: resData.data.createEvent._id,
          title: resData.data.createEvent.title,
          description: resData.data.createEvent.description,
          date: resData.data.createEvent.date,
          price: resData.data.createEvent.price,
          creator: {
            _id: this.context.userId
          }
        };

        // ✅ Add new event to local state & localStorage
        this.setState(prevState => {
          const updatedEvents = [...prevState.events, newEvent];
          saveToLocalStorage('events', updatedEvents);
          return { events: updatedEvents };
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  // ✅ Cancel modal handler
  modalCancelHandler = () => {
    this.setState({ creating: false, selectedEvent: null });
  };

  // ✅ Fetch all events (GraphQL QUERY)
  fetchEvents() {
    this.setState({ isLoading: true });

    const requestBody = {
      query: `
        query {
          events {
            _id
            title
            description
            date
            price
            creator {
              _id
              email
            }
          }
        }
      `
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const events = resData.data.events;
        if (this.isActive) {
          this.setState({ events: events, isLoading: false });
          saveToLocalStorage('events', events);
        }
      })
      .catch(err => {
        console.log(err);
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }

  // ✅ Set selected event to show details/book
  showDetailHandler = eventId => {
    this.setState(prevState => {
      const selectedEvent = prevState.events.find(e => e._id === eventId);
      return { selectedEvent: selectedEvent };
    });
  };

  // ✅ --- THIS IS A MUTATION ---
  // ✅ Runs when user clicks "Book"
  bookEventHandler = () => {
    if (!this.context.token) {
      this.setState({ selectedEvent: null });
      return;
    }

    const requestBody = {
      query: `
        mutation BookEvent($id: ID!) {
          bookEvent(eventId: $id) {
            _id
            createdAt
            updatedAt
          }
        }
      `,
      variables: {
        id: this.state.selectedEvent._id
      }
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
        console.log('Booking response:', resData); // ✅ Booking result
        this.setState({ selectedEvent: null }); // ✅ Close modal
      })
      .catch(err => {
        console.log(err);
      });
  };

  componentWillUnmount() {
    this.isActive = false;
  }

  render() {
    return (
      <React.Fragment>
        {/* ✅ Backdrop if creating or viewing details */}
        {(this.state.creating || this.state.selectedEvent) && <Backdrop />}

        {/* ✅ Modal for creating an event */}
        {this.state.creating && (
          <Modal
            title="Add Event"
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalConfirmHandler} // ✅ Confirm = CREATE EVENT MUTATION
            confirmText="Confirm"
          >
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" ref={this.titleElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input type="number" id="price" ref={this.priceElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input type="datetime-local" id="date" ref={this.dateElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea id="description" rows="4" ref={this.descriptionElRef} />
              </div>
            </form>
          </Modal>
        )}

        {/* ✅ Modal for viewing event details & booking */}
        {this.state.selectedEvent && (
          <Modal
            title={this.state.selectedEvent.title}
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.bookEventHandler} // ✅ Confirm = BOOK EVENT MUTATION
            confirmText={this.context.token ? 'Book' : 'Confirm'}
          >
            <h1>{this.state.selectedEvent.title}</h1>
            <h2>
              ${this.state.selectedEvent.price} -{' '}
              {new Date(this.state.selectedEvent.date).toLocaleDateString()}
            </h2>
            <p>{this.state.selectedEvent.description}</p>
          </Modal>
        )}

        {/* ✅ Button to open create modal (only if logged in) */}
        {this.context.token && (
          <div className="events-control">
            <p>Share your own Events!</p>
            <button className="btn" onClick={this.startCreateEventHandler}>
              Create Event
            </button>
          </div>
        )}

        {/* ✅ Event list or spinner */}
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <EventList
            events={this.state.events}
            authUserId={this.context.userId}
            onViewDetail={this.showDetailHandler}
          />
        )}
      </React.Fragment>
    );
  }
}

export default EventsPage;
