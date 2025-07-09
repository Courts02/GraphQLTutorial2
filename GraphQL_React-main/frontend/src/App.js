// ✅ React and React Router for SPA routing
import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

// ✅ Import pages (views)
import AuthPage from './pages/Auth';
import BookingsPage from './pages/Bookings';
import EventsPage from './pages/Events';

// ✅ Import your main nav component
import MainNavigation from './components/Navigation/MainNavigation';

// ✅ Import your custom AuthContext for global state
import AuthContext from './context/auth-context';

// ✅ Import styles
import './App.css';

class App extends Component {
  // ✅ Local state holds the token and userId when logged in
  state = {
    token: null,
    userId: null
  };

  // ✅ Called when the user logs in successfully
  // This saves the token and userId to state (and can be used to store in localStorage too)
  login = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId });
  };

  // ✅ Called when the user logs out
  logout = () => {
    this.setState({ token: null, userId: null });
  };

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          {/* ✅ Provide auth context to the entire app */}
          <AuthContext.Provider
            value={{
              token: this.state.token,
              userId: this.state.userId,
              login: this.login,
              logout: this.logout
            }}
          >
            {/* ✅ Your navigation bar — it can show different links if logged in/out */}
            <MainNavigation />

            {/* ✅ Your main page content */}
            <main className="main-content">
              <Switch>
                {/* ✅ Redirect root to /events if logged in */}
                {this.state.token && <Redirect from="/" to="/events" exact />}

                {/* ✅ If logged in, don’t let them see /auth, redirect to /events */}
                {this.state.token && (
                  <Redirect from="/auth" to="/events" exact />
                )}

                {/* ✅ If not logged in, show the Auth page */}
                {!this.state.token && (
                  <Route path="/auth" component={AuthPage} />
                )}

                {/* ✅ Always show the Events page */}
                <Route path="/events" component={EventsPage} />

                {/* ✅ If logged in, allow access to Bookings page */}
                {this.state.token && (
                  <Route path="/bookings" component={BookingsPage} />
                )}

                {/* ✅ If not logged in, redirect any unknown routes to /auth */}
                {!this.state.token && <Redirect to="/auth" exact />}
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
