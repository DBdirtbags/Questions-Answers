const mongoose = require('mongoose');
const uri = "mongodb://db:27017/qa";

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
  console.log('Successfully connected to MongoDB.');
})
.catch((err) => {
  console.error(err);
})

require('../src/models/questions.js');
require('../src/models/answerPhotos.js');
require('../src/models/answersWithPhotos.js');

let db = mongoose.connection;

module.exports = { db }
