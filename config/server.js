const express = require('express');
const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const qaRoutes = require('../src/routes.js');
app.use('/qa', qaRoutes);

module.exports = app;