var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var tablesort = require('tablesort');
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
// require passport
let passport = require('passport');
let session = require('express-session');
let localStrategy = require('passport-local').Strategy;
// link to model for auth
let user = require('./models/users');
var index = require('./routes/index');
var home = require('./routes/home')
// include the 3 main routes to assign their '/' directory
var employeeDashboard = require('./routes/employeeDashboard');

var expiringDashboard  = require('./routes/expiringDashboard');
var userManagment  = require('./routes/userManagment');
var contractors  = require('./routes/contractors');
const aws = require('aws-sdk');

let s3 = new aws.S3({
  accessKeyId: 'AKIAIYVQ4Q6NJ2ZJNUPA',
  secretAccessKey: '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'
});

//accessKeyId: process.env.S3_KEY ,
//secretAccessKey: process.env.S3_SECRET
//process.env.S3_BUCKET

var app = express();

// require mongoose, had to include the promise as per > cmd @warn
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var conn = mongoose.connection;
//connect to the database
var globals = require('./config/globals');
conn.open(globals.db);

// set ejs as the view engine and '/' folder for views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// for configuring passport and session
app.use(session({
secret: 'some salt value here',
resave: true,
saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// tells the app which .js folder to use as a route for each '/' url
app.use('/', home);
app.use('/home', index)
app.use('/employeeDashboard', employeeDashboard);

app.use('/expiringDashboard', expiringDashboard);
app.use('/userManagment', userManagment);
app.use('/contractors', contractors);





//for managing user login status
passport.use(user.createStrategy());
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error', {
    title: "Error"
  });
});
const S3_BUCKET = 'ramara-township-storage';
module.exports = app;
