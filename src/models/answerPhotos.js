const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AnswerPhotosSchema = new Schema({
  id: Number,
  answer_id: Number,
  body: String,
  url: String,
})

AnswerPhotosSchema.index({ answer_id: 1 })

const AnswerPhotosModel = mongoose.model('answers_photos', AnswerPhotosSchema);

module.exports = { AnswerPhotosModel }