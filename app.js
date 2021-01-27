const express = require('express');
const gql = require('express-graphql')
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');
const port = process.env.PORT || 4000;

const app = express();



mongoose.connect('mongodb+srv://<username>:<password>@<dbname>.zhmup.mongodb.net/<dbname>?retryWrites=true&w=majority',
    { useNewUrlParser: true });
mongoose.connection.once('open', () => {
    console.log('Hello Connection');
})

app.listen(port, () => {
    console.log('Listening for requests');
})

app.use(cors());
app.use('/graphql', gql.graphqlHTTP({
    graphiql: true,
    schema: schema
}))