var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);


// wechat
var wechat = require('wechat');
var config = {
  token: 'zzzkky',
  appid: 'wx1b09ecfa865e9bb5',
  encodingAESKey: 'Fq0kFt5O8qOpLLvBGyakdcYwoLB7qKNkj1t6o7xcAOe',
  appsecret: '9834aceb4c85815049e430838ebab55a'
};

var wechat_AI = require('./routes/wechat_AI');
app.use(express.query());
app.use('/wechat', wechat(config, wechat_AI));

var WechatAPI = require('wechat-api');
var api = new WechatAPI(config.appid, config.appsecret);
var menu = {
  "button":[
    {
      "name": "我的博客",
      "type": "click",
      "key": "00_00"
    },
    {
      "name": "关于我",
      "type": "click",
      "key": "01_00"
    }
  ]
};
api.createMenu(menu, function (err, result) {
  console.log(new Date(), "createMenu", err, result);
});


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
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
