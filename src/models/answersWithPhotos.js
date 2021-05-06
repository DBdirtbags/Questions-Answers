const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AnswersWithPhotosSchema = new Schema({})

AnswersWithPhotosSchema.index({ question_id: 1 })

const AnswersWithPhotosModel = mongoose.model('AnswersWithPhotosModel', AnswersWithPhotosSchema, 'answers_with_photos');

module.exports = AnswersWithPhotosModel;
