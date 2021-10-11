const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const filmItemSchema = new Schema({
    // id: String,

    url: String,
    title: String,
    overview:String,
    genres: [],
    release_date: String,
})

const filmItem = mongoose.model('favs', filmItemSchema);

module.exports = filmItem;