const Question = require('../models/questions.js');

//Retrieves a list of questions for a particular product.
exports.questionList = function(req, res) {
  res.send('Retrieves a list of questions for a particular product.');
}

//Adds a question for the given product
exports.questionPost = function(req, res) {
  res.send('Adds a question for the given product');
}

exports.questionHelpful = function(req, res) {
  res.send('Updates a question to show it was found helpful.');
}

exports.questionReport= function(req, res) {
  res.send('Updates a question to show it was reported.');
}