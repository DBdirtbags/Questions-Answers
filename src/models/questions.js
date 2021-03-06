const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const QuestionsSchema = new Schema({}, { strict: false });

QuestionsSchema.index({ product_id: 1, question_id: 1 });

const QuestionsModel = mongoose.model('QuestionsModel', QuestionsSchema, 'questions');

module.exports = QuestionsModel;