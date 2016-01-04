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
        } else if ( res.statusCode===200){
//            //res.status(200).send(objs); 
//            

//            res.status(200).send(html); 
var todolists='';
            for(var i in objs){
                console.log(objs[i]._id);
            
                todolists+='<div id='+objs[i]._id+' class="ui-widget-content">'+
                                    '<p>'+objs[i]._id+'</p>'+
                          '</div>';
            }
            var myhtml = ['<!DOCTYPE html>',
                     '<html>',
                       '<head>',
                            '<title>TODO supply a title</title>',
                            '<meta charset="UTF-8">',
                            '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
                            '<link rel="stylesheet" type="text/css" href="stylesheets/style.css"/>',
                            '<link rel="stylesheet" href="javascripts/jquery-ui-1.11.4/jquery-ui.css" type="text/css">',
                            '<link rel="stylesheet" href="javascripts/jquery-ui-1.11.4/jquery-ui.css" type="text/css"/>',
                            '<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min.js"></script>',
                            '<script type="text/javascript" src="javascripts/jquery-2.1.4.js"></script>',
                            '<script type="text/javascript" src="javascripts/jquery-ui-1.11.4/jquery-ui.js"></script>',

                            '<script>',
                                '$(function() {',
                                    '$( ".ui-widget-content" ).draggable();',
                                '});',
                            '</script>',
                       '</head>',
                       '<body>',
                       '<div id="todolistsarea">',
  
                            todolists,
                                
                                '<p>','todo1<input  type="checkbox" name="doneflag" value="ON" ></p>',
                
                                
                            
                            
                        '</div>',
                       '</body>',
                     '</html>'
                    ];
            res.write
                   (myhtml.join('')
                   );
            res.end();
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
