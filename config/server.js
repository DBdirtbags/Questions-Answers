const express = require('express');
const app = express();

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

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