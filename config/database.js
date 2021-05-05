const mongoose = require('mongoose');

const uri = "mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb";

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('Successfully connected to MongoDB.');
  })
  .catch((err) => {
    console.error(err);
  })

var db = mongoose.connection;

