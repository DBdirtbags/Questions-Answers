const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const QuestionsSchema = new Schema({
  id: Number,
  product_id: Number,
  body: String,
  date_written: Date,
  asker_name: String,
  asker_email: String,
  reported: Boolean,
  helpful: Number
})

QuestionsSchema.index({ product_id: 1 })

const QuestionsModel = mongoose.model('questions', QuestionsSchema);

module.exports = { QuestionsModel }