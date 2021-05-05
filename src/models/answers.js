const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AnswersSchema = new Schema({
  id: Number,
  question_id: Number,
  body: String,
  date_written: Date,
  answerer_name: String,
  answerer_email: String,
  reported: Boolean,
  helpful: Number
})

AnswersSchema.index({ question_id: 1 })

const AnswersModel = mongoose.model('answers', AnswersSchema);

module.exports = { AnswersModel }