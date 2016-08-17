var mongoose = require('mongoose');
var moment = require('moment');

var postSchema = mongoose.Schema({
  title: String,
  date: String,
  message: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  }
});

module.exports = mongoose.model('Post', postSchema);
