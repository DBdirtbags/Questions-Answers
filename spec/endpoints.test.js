const app = require("../config/server");
const mongoose = require("mongoose");
const supertest = require("supertest");
let Question, Answer;
jest.setTimeout(20000)

beforeAll((done) => {
  const uri = "mongodb://localhost/qa";
  mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}, () => {
    Question = require('../src/models/questions.js');
    require('../src/models/answerPhotos.js');
    Answer = require('../src/models/answersWithPhotos.js');
    done();
  })
})

afterAll((done) => {
  Question.deleteOne({product_id: 9998, asker_name: 'kelortondo'}, () => {
    Answer.deleteOne({answerer_name: 'kelortondo'}, () => {
      mongoose.connection.close(() => done())
    })
  });
})

describe('/questions', function() {
  let questionId = null;

  test('posts a question to /questions', async () => {
    const request = await supertest(app).post('/qa/questions/')
      .send({
        body: 'Is this comfortable?',
        name: 'kelortondo',
        email: 'kelortondo@gmail.com',
        product_id: 9998
      })
      .expect(201)
    let response = JSON.parse(request.res.text);
    questionId = response.question_id;
  })

  test('is able to retrieve the posted question', async () => {
    const response = await supertest(app).get(`/qa/questions/?product_id=9998&count=1000`)
      .expect(200)

    expect(response.body.product_id).toEqual("9998");
    let questions = response.body.results;
    let newQuestionPresent = false;

    for (let i = 0; i < questions.length; i++) {
      question = questions[i];
      if (question.question_id === questionId) {
        newQuestionPresent = true;
        break;
      }
    }

    expect(newQuestionPresent).toBe(true);
  })

  test('is able to mark a question as helpful', async () => {
    let newQuestionHelpfulness = 0;

    await supertest(app)
      .put(`/qa/questions/${questionId}/helpful`)
      .send({})
      .expect(204)
      .then(() => {
        supertest(app)
          .get(`/qa/questions/?product_id=9998&count=10`)
          .then((response) => {
            let questions = response.body.results;
            for (let i = 0; i < questions.length; i++) {
              question = questions[i];
              if (question.question_id === questionId) {
                newQuestionHelpfulness = question.question_helpfulness;
                break;
              }
            }
            expect(newQuestionHelpfulness).toBeGreaterThan(0);
          })
      })
  });

  test('is able to report a question', async () => {
    let newQuestionPresent = false;
    supertest(app)
      .put(`/qa/questions/${questionId}/report`)
      .send({})
      .expect(204)
      .then(() => {
        supertest(app)
          .get(`/qa/questions/?product_id=9998&count=1000`)
          .then((response) => {

            let questions = response.body.results;

            for (let i = 0; i < questions.length; i++) {
              question = questions[i];
              if (question.question_id === questionId) {
                newQuestionPresent = true;
                break;
              }
            }

          })
      })
      expect(newQuestionPresent).toBe(false);
    });
});

describe('/answers', function() {
  let answerId = null;

  test('posts an answer to a question', async () => {
    let request = await supertest(app).post('/qa/questions/1/answers')
      .send({
        body: 'Clouds and fairies',
        name: 'kelortondo',
        email: 'kelortondo@gmail.com',
        photos: ['https://images.unsplash.com/photo-1530519729491-aea5b51d1ee1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1651&q=80',
         'https://images.unsplash.com/photo-1500603720222-eb7a1f997356?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1653&q=80']
      })
      .expect(201)

    let response = JSON.parse(request.res.text);
    answerId = response.answer_id;
  })

  test('is able to retrieve the posted answer', async () => {
    const response = await supertest(app).get('/qa/questions/1/answers?count=1000')
      .expect(200)

    let answers = response.body.results;
    let newAnswerPresent = false;

    for (let i = 0; i < answers.length; i++) {
      let answer = answers[i];
      if (answer.answer_id === answerId) {
        newAnswerPresent = true;
        break;
      }
    }
    expect(newAnswerPresent).toBe(true);
  })

  test('is able to mark an answer as helpful', async () => {
    let newAnswerHelpfulness = 0;

    await supertest(app)
      .put(`/qa/answers/${answerId}/helpful`)
      .send({})
      .expect(204)
      .then(() => {
        supertest(app)
          .get('/qa/questions/1/answers?count=100')
          .then((response) => {
            let answers = response.body.results;

            for (let i = 0; i < answers.length; i++) {
              answer = answers[i];
              if (answer.answer_id === answerId) {
                newAnswerHelpfulness = answer.helpfulness;
                break;
              }
            }
            expect(newAnswerHelpfulness).toBeGreaterThan(0);
          })
      })

  });

  test('is able to report an answer', async () => {
    let newAnswerPresent = false;

    await supertest(app)
      .put(`/qa/answers/${answerId}/report`)
      .send({})
      .expect(204)
      .then(() => {
        supertest(app)
          .get('/qa/questions/1/answers?count=10')
          .then((response) => {

            let answers = response.body.results;

            for (let i = 0; i < answers.length; i++) {
              answer = answers[i];
              if (answer.answer_id === answerId) {
                newAnswerPresent = true;
                break;
              }
            }
          })
      })
    expect(newAnswerPresent).toBe(false);
  });
});

