const Question = require('../models/questions.js');

//Retrieves a list of questions for a particular product.
exports.questionList = function(req, res) {
  const id = parseInt(req.query.product_id);
  const count = parseInt(req.query.count) || 5;
  const page = parseInt(req.query.page) || 1;
  const lowerLimit = page * count - count + 1;
  const upperLimit = count * page;

  let cb = function (err, questions) {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      let data = { product_id: req.query.product_id, results: questions}
      res.status(200).send(data);
    }
  };

  let pipeline = [
    { $match: { product_id: id, reported: 0 }},
    { $sort: { question_helpfulness: -1 }},
    { $skip: (count* (page - 1)) },
    { $limit: (count) },
    { $addFields: { reported: false }},
    { $lookup : {
      from: 'answers_with_photos',
      localField: 'question_id',
      foreignField: 'question_id',
      as: 'answers'
    }},
    { $project: { _id: 0, question_id: 1, question_body: 1, question_date: 1, asker_name: 1, question_helpfulness: 1, reported: 1, 'answers': {
      $arrayToObject: {
        $map: {
          input: '$answers',
          as: 'el',
          in: {
            k: { $convert: {input: '$$el.answer_id', to: 'string'} },
            v: {
              id: '$$el.answer_id',
              body: '$$el.body',
              date: '$$el.date',
              answerer_name: '$$el.answerer_name',
              helpfulness: '$$el.helpfulness',
              photos: {
                $map: {
                  input: '$$el.photos',
                  as: 'photo',
                  in : {
                    id: '$$photo.id',
                    url: '$$photo.url'
                  }
                }
              }
            }
          }
        }
      }
    }
   }}
  ];

  Question.
    aggregate(pipeline).
    exec(cb)
}

//Adds a question for the given product
exports.questionPost = function(req, res) {
  const id = parseInt(req.body.product_id);
  const body = req.body.body;
  const name = req.body.name;
  const email = req.body.email;

  Question.countDocuments({}, async function (err, count) {
    if (err) {
      res.send(500);
    } else {
      await Question.create({
        question_id: count+1,
        product_id: id,
        question_body: body,
        question_date: new Date(),
        asker_name: name,
        asker_email: email,
        question_helpfulness: 0,
        reported: 0
      }, (err, result) => {
        if (err) {
          res.sendStatus(500);
        } else {
          res.status(201).send(result)
        }
      })
    }
  })
}

//Updates a question to show it was found helpful.
exports.questionHelpful = function(req, res) {
  const id = parseInt(req.params.question_id);
  Question.updateOne({question_id: id}, { $inc: {question_helpfulness: 1 }}, (err, result) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    }
  })
}

//Updates a question to show it was reported.
exports.questionReport= function(req, res) {
  const id = parseInt(req.params.question_id);
  Question.updateOne({question_id: id}, { $inc: {reported: 1 }}, (err, result) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    }
  })
}