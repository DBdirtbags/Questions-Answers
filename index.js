const db = require('./config/database');

const server = require('./config/server');
const port = 3000;

server.listen(port).on('error', (err) => {
  console.log('Error starting server');
  console.error(err);
  process.exit(0);
}).on('listening', () => {
  console.log('Server successfully started. Listening on port ' + port + '.');
});