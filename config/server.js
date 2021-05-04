const express = require('express');
const app = express();
const port = 3001;

app.listen(port).on('error', (err) => {
  console.log('Error starting server');
  console.error(err);
  process.exit(0);
}).on('listening', () => {
  console.log('Server successfully started. Listening on port ' + port '.');
})

module.exports = { app }