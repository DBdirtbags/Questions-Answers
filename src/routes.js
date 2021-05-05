var express = require('express');
var router = express.Router();

const questionsController = require('./controllers/questions');
const answersController = require('./controllers/answers');

router.get('/questions', questionsController.questionList);

router.get('/questions/:question_id/answers', answersController.answerList);

router.post('/questions', questionsController.questionPost);

router.post('/questions/:question_id/answers', answersController.answerPost);

router.put('/questions/:question_id/helpful', questionsController.questionHelpful);

router.put('/questions/:question_id/report', questionsController.questionReport);

router.put('/answers/:answer_id/helpful', answersController.answerHelpful);

router.put('/answers/:answer_id/report', answersController.answerReport);

module.exports = router;