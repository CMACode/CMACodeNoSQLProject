
var express = require('express');
var app = express();

var router = express.Router();


//var test = require('./test');
//var listAccessDBDriver = require('./listAccessDBDriver');;
//
//    var user1 = {name: 'modulus admin', age: 42, roles: ['admin', 'moderator', 'user']};
//    var user2 = {name: 'modulus user', age: 22, roles: ['user']};
//    var user3 = {name: 'modulus super admin', age: 92, roles: ['super-admin', 'admin', 'moderator', 'user']};
//    
//    console.log(user1);
    


//router.get('/:a?/:b?/:c?', function (req,res) {
//	res.send(req.params.a + ' ' + req.params.b + ' ' + req.params.c);
//});
/*
router.get('/:collection', function(req, res) { //A
   var params = req.params; //B
   collectionDriver.findAll(req.params.collection, function(error, objs) { //C
    	  if (error) { res.send(400, error); } //D
	      else { 
	          if (req.accepts('html')) { //E
    	          res.render('data',{objects: objs, collection: req.params.collection}); //F
              } else {
	          res.set('Content-Type','application/json'); //G
                  res.send(200, objs); //H
              }
         }
   	});
});
*/

/* GET home page. */
//router.get('/', function(req, res) {
//  res.render('index', { title: 'Express' });
//});
//
//router.get('/:a?', function (req,res) {
//        var queryString = req.params.a;
//        
//	res.send(queryString);
//});

/*
router.get('/', function(req, res, next) {
    
  res.send();
});
*/

module.exports = router;
