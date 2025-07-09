// Import bcrypt for hashing passwords securely
const bcrypt = require('bcryptjs');
// Import jsonwebtoken for creating login tokens
const jwt = require('jsonwebtoken');

// Import your Mongoose User model
const User = require('../../models/user');

// Export your resolvers
module.exports = {
  // ✅ This is a **GraphQL Mutation Resolver**
  // It handles creating a new user (adding to your MongoDB database)
  createUser: async args => {
    try {
      // Check if a user with the given email already exists
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error('User exists already.');
      }

      // Hash the user's password for security
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      // Create a new user instance
      const user = new User({
        email: args.userInput.email,
        password: hashedPassword
      });

      // Save the new user to the database (this is the actual mutation)
      const result = await user.save();

      // Return the saved user data, but don't return the password
      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err; // Handle any errors
    }
  },

  //  This is a **GraphQL Query/Resolver**
  // Technically `login` is usually written as a **Query** because it does not modify stored data,
  // it just checks credentials and returns a token.
  login: async ({ email, password }) => {
    // Find the user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error('User does not exist!');
    }

    // Compare given password with hashed password in DB
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error('Password is incorrect!');
    }

    // Create a JWT token if login is successful
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      'somesupersecretkey', // Replace with an env variable in production!
      {
        expiresIn: '1h' // Token expires in 1 hour
      }
    );

    // Return the token and user info to the client
    return { userId: user.id, token: token, tokenExpiration: 1 };
  }
};
