const express = require('express');
const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const port = 3001;

const qaRoutes = require('../src/routes.js');
app.use('/qa', qaRoutes);

app.listen(port).on('error', (err) => {
  console.log('Error starting server');
  console.error(err);
  process.exit(0);
}).on('listening', () => {
  console.log('Server successfully started. Listening on port ' + port + '.');
})

module.exports = { app }