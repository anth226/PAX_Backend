var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const resMainObj = require('./config/resObject')

require('dotenv').config()

process.env.width = 480;
process.env.height = 320;
process.env.numOfMaxFiles = 50;
const numOfMaxSec =  process.env.numOfMaxSec || (60*15)
process.env.numOfMaxSec = numOfMaxSec;
process.env.sizeOfFileMax = 50 * 1024 * 1024;
process.env.PORT = process.env.PORT_WRITE;
process.setMaxListeners(0);
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log("global err ",err);
  const { url } = req;
  const resObj = resMainObj();
  resObj.status = 404;
  resObj.error.systems = {
    count: 1,
    errors: [
      {
        domain: "url",
        value: `${url}`,
        message: `Url not found.`
      }
    ]
  };
  return res.status(404).json(resObj);
});

module.exports = app;
