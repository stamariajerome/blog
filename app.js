// ==========
// PACKAGES
// ==========
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var moment = require('moment');
var methodOverride = require('method-override');

// ==========
// CONFIG
// ==========
var app = express();
var databaseURL = process.env.DB || 'mongodb://localhost/blog';
mongoose.connect(databaseURL);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));

// ==========
// MODELS
// ==========
var Post = require('./models/post');

// ==========
// PAGES
// ==========
app.get('/', function(req, res) {
  res.redirect('/blog');
});

// ==========
// BLOGS
// ==========
app.get('/blog', function(req, res) {
  Post.find({}, function(err, posts) {
    res.render('blog/index', {posts: posts});
  });
});

//NEW
app.get('/blog/new', function(req, res) {
  res.render('blog/new');
});

//CREATE
app.post('/blog', function(req, res) {
  Post.create(req.body.post, function(err, newPost) {
    newPost.date = moment(newPost.date).format('LLLL');
    newPost.save();
    res.redirect('/blog');
  });
});

//SHOW
app.get('/blog/:id', function(req, res) {
  Post.findById(req.params.id, function(err, foundPost) {
    res.render('blog/show', {post: foundPost});
  });
});

//EDIT
app.get('/blog/:id/edit', function(req, res) {
  res.render('/blog/edit');
});

// ==========
// USERS
// ==========
app.get('/login', function(req, res) {
  res.render('users/login');
});

app.listen(process.env.PORT, process.env.IP, function() {
  console.log('Server Started!');
});
