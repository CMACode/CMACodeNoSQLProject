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
MongoClient.connect(mongoUrl, function (err, db) {
    if (!db) {
        console.error("Error! Exiting... Must start MongoDB first");
        process.exit(1); //D
    }
    listAccessDBDriver = new ListAccessDBDriver(db);
});

//200
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});


app.get('/getAllLists', function (req, res) {

    var params = req.query;
    var todoname = params['todoname'];
    var list = params['list'];
    //Bei Parameterübergabe
    if ((typeof todoname !== 'undefined') && (typeof list !== 'undefined')) {
//        console.log("::"+todoname+",,"+list);
//hier todo anlegen mit DB zugriff
        listAccessDBDriver.update(list, todoname, function (error, docs) {
            if (error) {
                res.status(400).send(error);
            } else if (res.statusCode === 200) {

            }
        }
        );
    }
    var alltodos = '';
    listAccessDBDriver.findAll('todos', function (error, docs) {
        if (error) {
            res.status(400).send(error);
        } else if (res.statusCode === 200) {
            alltodos = docs;
        }
    });
    listAccessDBDriver.findAll('list', function (error, objs) {
        if (error) {
            res.status(400).send(error);
        } else if (res.statusCode === 200) {
            var todolists = '';
            var todoListsForSelection = '';
            for (var i in objs) {
                // console.log(objs[i]['name']);

                todolists += '<div id=' + objs[i]._id + ' class="ui-widget-content">' +
                        '<p>' + objs[i]['name'] + '</p>';

                var specificList = objs[i]['name'];
                var objs2 = alltodos;
                var doneTodosCounter =0;
                for (var j in objs2) {//erst ohne checkhaken adden
//                    console.log("1 "+objs2[j]['belongstolist']);
//                    console.log("2 "+specificList);
                    if (objs2[j]['belongstolist'] === specificList) {
                        if (objs2[j]['doneflag'] === '0') {
                            todolists += '<div id=' + objs[i]._id + ' class="ui-widget-content2"><p id="'+objs2[j]['_id']+'" ondblclick=moveToDailyList(this)><input type="checkbox" name="'+objs2[j]['_id']+'" value="0N"  alt="'+objs2[j]["belongstolist"]+'" ';
                            if (objs2[j]['doneflag'] === '1') {
                                todolists += 'checked="checked" ';
                            } else {
                            }
                            todolists += 'onchange="checkedTodoFunction(this)">';
                            todolists += objs2[j]['name'] + '</p></div>';
                        }else{
                            doneTodosCounter++;
                        }
                    }
                }
                todolists+='<div id="'+objs[i].name+'" class="doneTodos"><h1>'+doneTodosCounter+' checked items</h1>';
                for (var j in objs2) {//dann mit checkhaken
                    if (objs2[j]['belongstolist'] === specificList) {
                        if (objs2[j]['doneflag'] === '1') {
                            todolists += '<p id="'+objs2[j]['_id']+'" ondblclick=moveToDailyList(this)><input type="checkbox" name="'+objs2[j]['_id']+'" value="0N" alt="'+objs2[j]["belongstolist"]+'" ';
                            {
                                todolists += 'checked="checked" ';
                                todolists += 'onchange="checkedTodoFunction(this)">';
                                todolists += objs2[j]['name'] + '</p>';
                            }
                        }
                    }
                    
                }
                todolists+='</div>';
                todolists+='<button>share list</button>';
                todolists+='<p>'+objs[i]['type']+'</p>';
                todolists+='</div>';
                todoListsForSelection += '<option>' + objs[i]['name'] + '</option>';
            }
            var dayname= new Array("So","Mo","Di","Mi","Do","Fr","Sa");
            var monthname= new Array("Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
            var datum = new Date();
            datum = dayname[datum.getDay()]+", "+datum.getDate()+"."+monthname[datum.getMonth()];
            var chckbxID='';
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
//                '$(function() {',
//                    '$( ".ui-widget-content" ).draggable();',
//                '});',
                '$(function() {',
                    '$( ".ui-widget-content2" ).draggable();',
                '});',
                '$(function() {',
                    '$( ".doneTodos" ).accordion({',
                        'collapsible: true, ',
                        'active: false',
                    '});',
                '});',
                    
               
                'function moveToDailyList(obj){',
                    'var toMove = document.getElementById(obj["id"]);',
                    'document.getElementById("dailyTodoList").appendChild(toMove);',
                '};',
                
                'function checkedTodoFunction(checkbox){',
                //'alert(obj["belongstolist"]);',
                'if (checkbox.checked)',
                '{',
                 'var toMove = document.getElementById(checkbox["name"]);',//hier das p getten
                 'document.getElementById(checkbox["alt"]).appendChild(toMove);', //Hier die doneliste zum einfügen finden
//                'alert(checkbox["id"]+"checked");', //hier collection updaten
//                '$(".ui-widget-content").load(location.href+" .ui-widget-content>*","");',
//                    listAccessDBDriver.updateCheckbox(chckbxID,"1"),
                '}else{',
//                'alert("unchecked");', //hier collection updaten
//                    listAccessDBDriver.updateCheckbox(chckbxID,'0'),
                '}',
                '};',
                '</script>',
                '</head>',
                '<body>',
                '<div id="createtodoarea">',
                '<form>',
                '<input id="addtodotextfield" type="text" name="todoname" value=""/>',
                '<select name="list">',
                todoListsForSelection,
                '</select>',
                '<input type="submit" value="add Todo"/>',
                '</form>',
                '</div>',
                '<div id="todolistsarea">',
                '<div id="dailyTodoList" class="ui-widget-content"><p>'+datum+'</p></div>',
                '<div id="privateBacklogList" class="own"><p>private backlog</p></div>',
                '<div id="einkaufenList" class="own"><p>Einkaufen</p></div>',
                '<div id="workBacklogList" class="own"><p>work backlog</p></div>',
                todolists,
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
app.get('/getAllLists/:id', function (req, res) {
    var params = req.params;
    console.log("todo: get Lists for User id");
    listAccessDBDriver.findAll(params.id, function (error, objs) {
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(200).send(objs); 
        }
    });
});


app.get('/getPublicList', function (req, res) {
    var params = req.params;
    console.log("todo: getpublic all public lists");
//    listAccessDBDriver.findAll(params.id, function (error, objs) {
//        if (error) {
//            res.status(400).send(error);
//        } else {
//            res.status(200).send(objs); 
//        }
//    });
});

app.get('/getPublicList/:id', function (req, res) {
    var params = req.params;
    console.log("todo: getpublic list with id: "+params.id);
//    listAccessDBDriver.findAll(params.id, function (error, objs) {
//        if (error) {
//            res.status(400).send(error);
//        } else {
//            res.status(200).send(objs); 
//        }
//    });
});

//
app.get('/:collection', function (req, res) {
    var params = req.params;
    listAccessDBDriver.findAll(req.params.collection, function (error, objs) {
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(200).send(objs); 
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
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

//


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



module.exports = app;
