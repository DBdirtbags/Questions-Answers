const app = require("../config/server");
const mongoose = require("mongoose");
const supertest = require("supertest");
let Question, Answer;

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
  test('returns the correct data for a GET request to /questions', async () => {
    const response = await supertest(app).get('/qa/questions/?product_id=9998&count=3&page=2')
      .expect(200)

    expect(response.body.product_id).toEqual("9998");
    expect(response.body.results.length).toEqual(3);
    expect(response.body.results[1].asker_name).toEqual("Trevion.Terry72");
  })

  test('posts a question to /questions', async () => {
    const request = await supertest(app).post('/qa/questions/')
      .send({
        body: 'Is this comfortable?',
        name: 'kelortondo',
        email: 'kelortondo@gmail.com',
        product_id: 9998
      })
      .expect(201)
  })

  test('is able to retrieve the posted question', async () => {
    const response = await supertest(app).get(`/qa/questions/?product_id=9998&count=10`)
      .expect(200)

    expect(response.body.product_id).toEqual("9998");
    expect(response.body.results.length).toEqual(8);
    expect(response.body.results[7].asker_name).toEqual("kelortondo");
  })

  test('is able to mark a question as helpful', (done) => {
    let query = Question.findOne({product_id: 9998, asker_name: 'kelortondo'}).select('question_id -_id');
    query.exec((err, qnum) => {
      if (err) {
        console.error(err);
      } else {
        supertest(app)
          .put(`/qa/questions/${qnum._doc.question_id}/helpful`)
          .send({})
          .expect(204)
          .then(() => {
            supertest(app)
             .get(`/qa/questions/?product_id=9998&count=10`)
             .then((response) => {
               expect(response.body.results[7].question_helpfulness).toEqual(1)
               done();
             })
             .catch(err => done(err))
          })
          .catch(err => done(err))
      }
    })
  });

  test('is able to report a question', (done) => {
    let query = Question.findOne({product_id: 9998, asker_name: 'kelortondo'}).select('question_id -_id');
    query.exec((err, qnum) => {
      if (err) {
        console.error(err);
      } else {
        supertest(app)
          .put(`/qa/questions/${qnum._doc.question_id}/report`)
          .send({})
          .expect(204)
          .then(() => {
            supertest(app)
             .get(`/qa/questions/?product_id=9998&count=10`)
             .then((response) => {
               expect(response.body.results.length).toEqual(7);
               done();
             })
             .catch(err => done(err))
          })
          .catch(err => done(err))
      }
    })
  });
});

describe('/answers', function() {
  test('returns the answers to a given question', async () => {
    const response = await supertest(app).get('/qa/questions/1/answers?count=3&page=2')
      .expect(200)

    expect(response.body.question).toEqual("1");
    expect(response.body.page).toEqual(2);
    expect(response.body.count).toEqual(3);
    expect(response.body.results.length).toEqual(2);
    expect(response.body.results[0].answerer_name).toEqual("metslover");
  })

  test('posts an answer to a question', async () => {
    jest.setTimeout(30000)
    await supertest(app).post('/qa/questions/1/answers')
      .send({
        body: 'Clouds and fairies',
        name: 'kelortondo',
        email: 'kelortondo@gmail.com',
        photos: ['https://images.unsplash.com/photo-1530519729491-aea5b51d1ee1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1651&q=80',
         'https://images.unsplash.com/photo-1500603720222-eb7a1f997356?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1653&q=80']
      })
      .expect(201)
  })

  test('is able to retrieve the posted answer', async () => {
    const response = await supertest(app).get('/qa/questions/1/answers?count=10')
      .expect(200)

      expect(response.body.question).toEqual("1");
      expect(response.body.results.length).toEqual(6);
      expect(response.body.results[5].answerer_name).toEqual("kelortondo");
  })

  test('is able to mark an answer as helpful', (done) => {
    let query = Answer.findOne({answerer_name: 'kelortondo'}).select('answer_id -_id');
    query.exec((err, anum) => {
      if (err) {
        console.error(err);
      } else {
        supertest(app)
          .put(`/qa/answers/${anum._doc.answer_id}/helpful`)
          .send({})
          .expect(204)
          .then(() => {
            supertest(app)
             .get('/qa/questions/1/answers?count=10')
             .then((response) => {
               console.log(response.body);
               expect(response.body.results[5].helpfulness).toEqual(1)
               done();
             })
             .catch(err => done(err))
          })
          .catch(err => done(err))
      }
    })
  });

  test('is able to report an answer', (done) => {
    let query = Answer.findOne({answerer_name: 'kelortondo'}).select('answer_id -_id');
    query.exec((err, anum) => {
      if (err) {
        console.error(err);
      } else {
        supertest(app)
          .put(`/qa/answers/${anum._doc.answer_id}/report`)
          .send({})
          .expect(204)
          .then(() => {
            supertest(app)
             .get('/qa/questions/1/answers?count=10')
             .then((response) => {
               console.log(response.body);
               expect(response.body.results.length).toEqual(5);
               done();
             })
             .catch(err => done(err))
          })
          .catch(err => done(err))
      }
    })
  });
})
