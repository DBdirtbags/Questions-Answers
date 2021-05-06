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
    } else {
      let data = { product_id: req.query.product_id, results: questions}
      res.status(200).send(data);
    }
  };


  let pipeline = [
    { $match: { product_id: id, reported: 0 }},
    { $sort: { helpful: -1 }},
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
            k: { $convert: {input: '$$el.id', to: 'string'} },
            v: {
              id: '$$el.id',
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
  console.log(req.body);
  const id = parseInt(req.body.product_id);
  const body = req.body.body;
  const name = req.body.name;
  const email = req.body.email;

  // await Question.create({
  //   id:
  //   product_id: id,
  //   body: body,
  //   date_written:
  //   asker_name: name,
  //   asker_email:
  //   helpful: 0,
  //   reported: false
  // })
}

//Updates a question to show it was found helpful.
exports.questionHelpful = function(req, res) {
  res.send('Updates a question to show it was found helpful.');
}

//Updates a question to show it was reported.
exports.questionReport= function(req, res) {
  res.send('Updates a question to show it was reported.');
}