const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AnswerPhotosSchema = new Schema({})

AnswerPhotosSchema.index({ answer_id: 1 })

const AnswerPhotosModel = mongoose.model('AnswerPhotosModel', AnswerPhotosSchema, 'answers_photos');

module.exports = AnswerPhotosModel