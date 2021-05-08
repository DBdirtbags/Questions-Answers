const Answer = require('../models/answersWithPhotos.js');
const AnswerPhotos = require('../models/answerPhotos.js');

//Returns answers for a given question.
exports.answerList = function(req, res) {
  const id = parseInt(req.params.question_id);
  const count = parseInt(req.query.count) || 5;
  const page = parseInt(req.query.page) || 1;
  const lowerLimit = page * count - count + 1;
  const upperLimit = count * page;

  let cb = function (err, answers) {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      let data = {
        question: req.params.question_id,
        page: page,
        count: count,
        results: answers
      }
      res.status(200).send(data);
    }
  };

  let pipeline = [
    { $match: { question_id: id, reported: 0 }},
    { $sort: { helpfulness: -1 }},
    { $skip: (count* (page - 1)) },
    { $limit: (count) },
    { $project: {
      _id: 0,
      id: 0,
      question_id: 0,
      answerer_email: 0,
      reported: 0,
      __v: 0,
      'photos._id': 0,
      'photos.answer_id': 0
    }}
  ];

  Answer.
    aggregate(pipeline).
    exec(cb)
}

//Adds an answer for the given question.
exports.answerPost = function(req, res) {
  const id = parseInt(req.params.question_id);
  const body = req.body.body;
  const name = req.body.name;
  const email = req.body.email;
  const photos = req.body.photos;
  let photoObjs;

  let query = AnswerPhotos.findOne({}).sort('-id');
  query.exec((err, lastDoc) => {
    if (err) {
      console.error(err);
    } else {
      let photoId = (lastDoc._doc.id);
      photoObjs = photos.map((photo) => {
        return ({id: photoId++, url: photo})
      })
      Answer.countDocuments({}, async function (err, count) {
        if (err) {
          res.send(500);
        } else {
          await Answer.create({
            answer_id: count+1,
            question_id: id,
            body: body,
            date: new Date(),
            answerer_name: name,
            answerer_email: email,
            helpfulness: 0,
            reported: 0,
            photos: photoObjs
          }, (err, result) => {
            if (err) {
              res.sendStatus(500);
            } else {
              res.sendStatus(201);
            }
          })
        }
      })
    }
  })
}


//Updates an answer to show it was found helpful.
exports.answerHelpful = function(req, res) {
  const id = parseInt(req.params.answer_id);
  Answer.updateOne({answer_id: id}, { $inc: {helpfulness: 1 }}, (err, result) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    }
  })
}

//Updates an answer to show it has been reported.
exports.answerReport= function(req, res) {
  const id = parseInt(req.params.answer_id);
  Answer.updateOne({answer_id: id}, { $inc: {reported: 1 }}, (err, result) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    }
  })
}