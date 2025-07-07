const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Add logging in auth middleware for debug
app.use((req, res, next) => {
  console.log('Authorization header:', req.get('Authorization'));
  next();
});

app.use(isAuth);

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true,
    customFormatErrorFn(err) {
      console.error('GraphQL Error:', err);
      return err;
    }
  })
);

mongoose
  .connect(
    'mongodb+srv://rousseaucadee:D9Msn3ZuF0HhEd9r@cluster0.e02fvc1.mongodb.net/event-booking?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    app.listen(8000, () => {
      console.log('Server running on http://localhost:8000/graphql');
    });
  })
  .catch(err => {
    console.log(err);
  });