const express = require('express');
const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const qaRoutes = require('../src/routes.js');
app.use('/qa', qaRoutes);

app.get('/loaderio-b4790224ec1fa07e79efcdfacba71480', (req, res) => {
  res.send('loaderio-b4790224ec1fa07e79efcdfacba71480');
})

module.exports = app;