import React from 'react';
import { NavLink } from 'react-router-dom';

import AuthContext from '../../context/auth-context';
import './MainNavigation.css';

// Navigation bar component that adapts links based on auth state
const mainNavigation = props => (
  <AuthContext.Consumer>
    {context => {
      return (
        <header className="main-navigation">
          <div className="main-navigation__logo">
            <h1>EasyEvent</h1> {/* App logo/title */}
          </div>
          <nav className="main-navigation__items">
            <ul>
              {/* Show Authenticate link only if NOT logged in */}
              {!context.token && (
                <li>
                  <NavLink to="/auth">Authenticate</NavLink>
                </li>
              )}
              {/* Events link is always visible */}
              <li>
                <NavLink to="/events">Events</NavLink>
              </li>
              {/* If logged in, show Bookings link and Logout button */}
              {context.token && (
                <React.Fragment>
                  <li>
                    <NavLink to="/bookings">Bookings</NavLink>
                  </li>
                  <li>
                    {/* Calls logout function from AuthContext to log user out */}
                    <button onClick={context.logout}>Logout</button>
                  </li>
                </React.Fragment>
              )}
            </ul>
          </nav>
        </header>
      );
    }}
  </AuthContext.Consumer>
);

export default mainNavigation;
