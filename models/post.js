var mongoose = require('mongoose');
var moment = require('moment');

var postSchema = mongoose.Schema({
  title: String,
  author: {
    type: String,
    default: 'Anonymous'
  },
  content: String,
  date: {
    type: String
  },
  message: String,
});

module.exports = mongoose.model('Post', postSchema);
