const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AnswersSchema = new Schema({}, { strict: false })

AnswersSchema.index({ question_id: 1 })

const AnswersModel = mongoose.model('AnswersModel', AnswersSchema, 'answers');

module.exports = AnswersModel