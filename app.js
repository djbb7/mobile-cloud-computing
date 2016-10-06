var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');

var users = require('./routes/users');
var applications = require('./routes/applications');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json()); // for parsing application/json message body
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/static', express.static('public')); //logos of files
app.use('/users', users); //session handling
app.use('/application', applications); //application list

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
});


module.exports = app;


