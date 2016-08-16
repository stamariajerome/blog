// ==========
// PACKAGES
// ==========
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var moment = require('moment');
var methodOverride = require('method-override');
var expressSanitizer = require('express-sanitizer');
var passport = require('passport');
var LocalStrategy = require('passport-local');

// ==========
// MODELS
// ==========
var Post = require('./models/post');
var User = require('./models/user');

// ==========
// CONFIG
// ==========
var app = express();
// var databaseURL = process.env.DB || 'mongodb://localhost/blog';
app.use(require('express-session')({
  secret: 'This is a secret key for the application',
  resave: false,
  saveUninitialized: false
}));
mongoose.connect('mongodb://localhost/blog');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));


// TODO make this session
app.use(function(req, res, next) {
  console.log(req.user);
  next();
});

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
  req.body.post.title = req.sanitize(req.body.post.title);
  req.body.post.message = req.sanitize(req.body.post.message);
  Post.create(req.body.post, function(err, newPost) {
    if(err) {
      console.log(err);
    } else {
      newPost.date = moment(newPost.date).format('LLLL');
      newPost.save();
      res.redirect('/blog');
    }
  });
});

//SHOW
app.get('/blog/:id', function(req, res) {
  Post.findById(req.params.id, function(err, foundPost) {
    if(err) {
      console.log(err);
    } else {
      res.render('blog/show', {post: foundPost});
    }
  });
});

//EDIT
app.get('/blog/:id/edit', function(req, res) {
  Post.findById(req.params.id, function(err, foundPost) {
    if(err) {
      console.log(err);
    } else {
      res.render('blog/edit', {post: foundPost});
    }
  });
});

//UDATE
app.put('/blog/:id', function(req, res) {
  req.body.post.title = req.sanitize(req.body.post.title);
  req.body.post.message = req.sanitize(req.body.post.message);
  Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, foundPost) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/blog/' + req.params.id);
    }
  });
});

//DESTROY
app.delete('/blog/:id', function(req, res) {
  Post.findByIdAndRemove(req.params.id, function(err, foundPost) {
    if(err) {
      console.log(err);
    } else {
      console.log('Post ' + req.params.id + ' has been deleted');
      res.redirect('/blog');
    }
  });
});

// ==========
// USERS
// ==========
app.get('/login', function(req, res) {
  res.render('users/login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/blog',
  failureRedirect: '/login'
}), function(req, res) {
});

app.get('/register', function(req, res) {
  res.render('users/register');
});

app.post('/register', function(req, res) {
  User.register(new User({username: req.body.username}), req.body.password, function(err, newUser) {
    if(err) {
      console.log(err);
    } else {
      passport.authenticate('local')(req, res, function() {
        res.redirect('/blog');
      });
    }
  });
});

app.listen(process.env.PORT, process.env.IP, function() {
  console.log('Server Started!');
});
