const app = require("../config/server");
const mongoose = require("mongoose");
const supertest = require("supertest");
let Question, qnum;

beforeAll((done) => {
  const uri = "mongodb://localhost/qa";
  mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}, () => {
    Question = require('../src/models/questions.js');
    require('../src/models/answerPhotos.js');
    require('../src/models/answersWithPhotos.js');
    done();
  })
})

afterAll((done) => {
  Question.deleteOne({product_id: 9998, asker_name: 'kelortondo'}, () => {
   mongoose.connection.close(() => done())
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


xtest('PUT /qa/questions/report', async () => {
  let qnum = await Question.findOne({product_id: 9998, asker_name: 'kelortondo'});
  await supertest(app).put(`/qa/questions/${qnum.question_id}/report`)
    .expect(204)
    .then(() => {
      supertest(app).get('/qa/questions/?product_id=9998&count=10')
      .expect(200)
      .then((response) => {
        expect(response.body.results.length).toEqual(7);
      });
    })
});

