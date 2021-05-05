const Answer = require('../models/answers.js');

//Returns answers for a given question.
exports.answerList = function(req, res) {
  res.send('Returns answers for a given question.')
}

//Adds an answer for the given question.
exports.answerPost = function(req, res) {
  res.send('Adds an answer for the given question.')
}

//Updates an answer to show it was found helpful.
exports.answerHelpful = function(req, res) {
  res.send('Updates an answer to show it was found helpful.')
}

//Updates an answer to show it has been reported.
exports.answerReport= function(req, res) {
  res.send('Updates an answer to show it has been reported.')
}