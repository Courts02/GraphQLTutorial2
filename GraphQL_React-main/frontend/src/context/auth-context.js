import React from 'react';

// Create and export an AuthContext with default values
export default React.createContext({
    token: null,             // JWT token string when logged in, otherwise null
    userId: null,            // User's ID when logged in, otherwise null
    login: (token, userId, tokenExpiration) => {},  // Function to set auth state (to be implemented)
    logout: () => {}         // Function to clear auth state (to be implemented)
});
