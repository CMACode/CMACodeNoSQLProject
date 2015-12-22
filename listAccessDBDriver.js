var ObjectID = require('mongodb').ObjectID;

ListAccessDBDriver = function(db) {
  this.db = db;
};

ListAccessDBDriver.prototype.getCollection = function(collectionName, callback) {
  this.db.collection(collectionName, function(error, the_collection) {
    if( error ) callback(error);
    else callback(null, the_collection);
  });
};

//find all objects of a collection
ListAccessDBDriver.prototype.findAll = function(collectionName, callback) {
    this.getCollection(collectionName, function(error, the_collection) { //A
      if( error ) callback(error);
      else {
        the_collection.find().toArray(function(error, results) { //B
          if( error ) callback(error);
          else callback(null, results);
        });
      }
    });
};

//find a specific object
ListAccessDBDriver.prototype.get = function(collectionName, id, callback) { //A
    this.getCollection(collectionName, function(error, the_collection) {
        if (error) callback(error);
        else {
            var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$"); //B
            if (!checkForHexRegExp.test(id)) callback({error: "invalid id"});
            else the_collection.findOne({'_id':ObjectID(id)}, function(error,doc) { //C
            	if (error) callback(error);
            	else callback(null, doc);
            });
        }
    });
};

//find a specific Team
ListAccessDBDriver.prototype.getTeam = function(collectionName, id, callback) { //A
    this.getCollection(collectionName, function(error, the_collection) {
        if (error) {
			callback(error);
        }
		else {
            //var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$"); //B	// Nur Team Namen zulassenn
			checkForHexRegExp = true;
            /*if (!checkForHexRegExp.test(id)) {
				callback({error: "invalid id"});
			}
            else */
			the_collection.findOne({'team_id':id}, function(error,doc) { //C7
			if (error) callback(error);
            	else callback(null, doc);
            });
        }
    });
};

//save new object
ListAccessDBDriver.prototype.save = function(collectionName, obj, callback) {
	this.getCollection(collectionName, function(error, the_collection) { //A
      if( error ) callback(error);
      else {
        obj.created_at = new Date(); //B
        the_collection.save(obj, function(err, saved) { //C
          callback(null, obj);
        });
      }
    });
};

//update a specific object
ListAccessDBDriver.prototype.update = function(collectionName, obj, entityId, callback) {
    this.getCollection(collectionName, function(error, the_collection) {
        if (error) callback(error);
        else {
	        //obj._id = ObjectID(entityId); //A convert to a real obj id
	        obj.updated_at = new Date(); //B
            the_collection.updateOne({"_id":ObjectID(entityId)}, {$set: obj}, function(error,doc) { //C
            	if (error) callback(error);
            	else callback(null, obj);
            });
        }
    });
};

//delete a specific object
ListAccessDBDriver.prototype.delete = function(collectionName, entityId, callback) {
    this.getCollection(collectionName, function(error, the_collection) { //A
        if (error) callback(error);
        else {
            the_collection.remove({'_id':ObjectID(entityId)}, function(error,doc) { //B
            	if (error) callback(error);
            	else callback(null, doc);
            });
        }
    });
};

exports.ListAccessDBDriver = ListAccessDBDriver;

//var MongoClient = require('mongodb').MongoClient;
//var ObjectId = require('mongodb').ObjectID;
//var url = 'mongodb://localhost:27017/todoListDB';
//var assert = require('assert');
//
//var findCollection = function(db, callback) {
//   var cursor =db.collection('list').find();
//   cursor.each(function(err, doc) {
//      assert.equal(err, null);
//      if (doc !== null) {
//         console.dir(doc);
//         
//      } else {
//         callback();
//      }
//   });
////   var result = db.collection('list').findOne(
////        {
////            $or:[
////                {_id:ObjectId("566ad3448ae39cb116ab057c")}
////            ]
////        }
////    );
////    console.log(result);
//};
////
////
//MongoClient.connect(url, function(err, db) {
//  assert.equal(null, err);
//  console.log("Connected correctly to the Mongoserver.");
//    findCollection(db, function() {
//      db.close();
//    });
//});
//
//

