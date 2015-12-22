var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoUrl = 'mongodb://localhost:27017/todoListDB';
var routes = require('./routes/index');
var users = require('./routes/users');
var ListAccessDBDriver = require('./listAccessDBDriver').ListAccessDBDriver;
var listAccessDBDriver;

//
MongoClient.connect(mongoUrl, function(err, db) { //C
  if (!db) {
      console.error("Error! Exiting... Must start MongoDB first");
      process.exit(1); //D
  }
  listAccessDBDriver = new ListAccessDBDriver(db); //F
});

//200
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/public/index.html');
});


app.get('/getPublicList', function (req, res) {
    var params = req.params;
    listAccessDBDriver.findAll('list', function(error, objs) {
        if (error) { 
            res.status(400).send(error); 
        } else {
            res.status(200).send(objs); 
        }
    });
});

//
app.get('/:collection', function(req, res) { //A
   var params = req.params;
   listAccessDBDriver.findAll(req.params.collection, function(error, objs) { //C
    	  if (error) { res.status(400).send(error); } //D
	      else { 
	          /*if (req.accepts('html')) { //E
    	          res.render('data',{objects: objs, collection: req.params.collection}); //F
              } else {
				res.set('Content-Type','application/json'); //G*/
                  res.status(200).send(objs); //H
              //}
         }
    });
});

app.get('/createToDo', function(req, res) { //A
   var params = req.params;
   listAccessDBDriver.findAll(req.params.collection, function(error, objs) { //C
    	  if (error) { res.status(400).send(error); } //D
	      else { 
	          /*if (req.accepts('html')) { //E
    	          res.render('data',{objects: objs, collection: req.params.collection}); //F
              } else {
				res.set('Content-Type','application/json'); //G*/
                  res.status(200).send(objs); //H
              //}
         }
    });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

//


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
