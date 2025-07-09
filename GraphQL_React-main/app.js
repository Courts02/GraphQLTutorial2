// ✅ Import Express to create the server
const express = require('express');

// ✅ Import body-parser to parse incoming JSON requests
const bodyParser = require('body-parser');

// ✅ Import GraphQL HTTP server middleware
const { graphqlHTTP } = require('express-graphql');

// ✅ Import Mongoose to connect to MongoDB
const mongoose = require('mongoose');

// ✅ Import your GraphQL Schema and Resolvers
const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

// ✅ Import your custom authentication middleware
const isAuth = require('./middleware/is-auth');

// ✅ Create the Express app
const app = express();

// ✅ Use body-parser to parse all JSON bodies in incoming requests
app.use(bodyParser.json());

// ✅ Enable CORS for all incoming requests
// This allows your frontend to communicate with this API
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS'); // Allow these HTTP methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow these headers
  if (req.method === 'OPTIONS') {
    // Preflight request → short-circuit with success
    return res.sendStatus(200);
  }
  next();
});

// ✅ Optional: Add a debug log to see incoming Authorization headers
app.use((req, res, next) => {
  console.log('Authorization header:', req.get('Authorization'));
  next();
});

// ~~~~~~~~~~~~~~~
// ✅ Use your authentication middleware
// This adds req.isAuth and req.userId for your resolvers to check
app.use(isAuth);

// ✅ Connect the GraphQL endpoint at /graphql
app.use(
  '/graphql',
  graphqlHTTP((req, res) => ({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: {
      headerEditorEnabled: true
    },
    context: { req, res }
  }))
);

// ~~~~~~~~~~~~~


// ✅ Connect to MongoDB Atlas using Mongoose
mongoose
  .connect(
    'mongodb+srv://rousseaucadee:D9Msn3ZuF0HhEd9r@cluster0.e02fvc1.mongodb.net/event-booking?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    // ✅ Once connected to MongoDB, start the server
    app.listen(8000, () => {
      console.log('Server running on http://localhost:8000/graphql');
    });
  })
  .catch(err => {
    console.log(err);
  });
