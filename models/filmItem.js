const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const filmItemSchema = new Schema({
    url: String,
    title: String,
    overview:String,
    genres: String,
    release_date: String,
})

const filmItem = mongoose.model('favs', filmItemSchema);

module.exports = filmItem;