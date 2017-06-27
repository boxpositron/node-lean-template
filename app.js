require('dotenv').load();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');

const MongoStore = require('connect-mongo')(session);

require('./config/passport')(passport);

var app = express();

mongoose.connect(process.env.MONGODB_URI, function(err) {
    if (err) {
        console.log('Database was not able to connect.');
    } else {
        console.log('Database is connected.')
    }
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var options = {
  mongooseConnection: mongoose.connection
}

app.use(session({
    key: process.env.SESSION_KEY,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    secret: process.env.SESSION_SECRET,
    store: new MongoStore(options)
}));


app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());


var normal_routes = express.Router();
var protected_routes = express.Router();

require('./routes/protected_routes')(passport,protected_routes);
require('./routes/normal_routes')(normal_routes);

app.use('/', normal_routes);
app.use('/', protected_routes);

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
  res.render('error',{title:"Error"});
});

module.exports = app;
