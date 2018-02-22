var express     = require('express');
var session     = require('express-session');
var path        = require('path');
var favicon     = require('serve-favicon');
var logger      = require('morgan');
var cookieParser 
                = require('cookie-parser');
var bodyParser  = require('body-parser');
var flash       = require('connect-flash');
var passport    = require('passport');

var config      = require('./config');
var index       = require('./routes/index');
var users       = require('./routes/users');

var app = express();

app.use(flash());
app.use(session({secret: config.sessionSecret, saveUninitialized: true, resave: true}));

var pp = require('./pp');

//all the good passport stuff are stored here (in pp.js)
pp.init(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

app.get('/login', function (req, res) {
    res.render('login', { title: "Login", message: req.flash('loginMessage') });
});

app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/myaccount', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

//check if user is logged in -- use in restricted areas
isLoggedIn = function (req, res, next) {
      if(req.isAuthenticated()) {
          next();
      } else {
          res.redirect('/');
      }
};

app.get('/myaccount', isLoggedIn, function (req, res) {
   res.render('myaccount', {title:'My account', user: req.user}); 
});

app.get('/register', function (req, res) {
    res.render('register', { title: "Register", message: req.flash('registerMessage') });
});

app.post('/register', passport.authenticate('local-signup', {
    successRedirect : '/myaccount', //member page
    failureRedirect : '/login', //failed login
    failureFlash : true //flash msg
}));

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});




// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
