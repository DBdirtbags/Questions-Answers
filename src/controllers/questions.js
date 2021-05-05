const Question = require('../models/questions.js');

//Req parameters: product_id (int), page (int, default 1), count (int, default 5)

//Retrieves a list of questions for a particular product.
exports.questionList = function(req, res) {
  const id = parseInt(req.query.product_id);
  const count = parseInt(req.query.count) || 5;
  const page = parseInt(req.query.page) || 1;

  let lowerLimit = page * count - count + 1;
  let upperLimit = count * page;

  let cb = function (err, questions) {
    if (err) {
      console.error(err);
    } else {
      let data = {};
      data.product_id = req.query.product_id;
      data.results = questions;
      res.status(200).send(data);
    }
  };

  Question.
    find({product_id: id}).
    where('id').gte(lowerLimit).lte(upperLimit).
    sort('-helpful').
    lean().
    exec(cb)
}

//Adds a question for the given product
exports.questionPost = function(req, res) {
  res.send('Adds a question for the given product');
}

//Updates a question to show it was found helpful.
exports.questionHelpful = function(req, res) {
  res.send('Updates a question to show it was found helpful.');
}

//Updates a question to show it was reported.
exports.questionReport= function(req, res) {
  res.send('Updates a question to show it was reported.');
}