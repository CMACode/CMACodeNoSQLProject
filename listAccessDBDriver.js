var ObjectID = require('mongodb').ObjectID;

ListAccessDBDriver = function (db) {
    this.db = db;
};

ListAccessDBDriver.prototype.getCollection = function (collectionName, callback) {
    this.db.collection(collectionName, function (error, the_collection) {
        if (error)
            callback(error);
        else
            callback(null, the_collection);
    });
};

//find all objects of a collection
ListAccessDBDriver.prototype.findAll = function (collectionName, callback) {
    this.getCollection(collectionName, function (error, the_collection) { //A
        if (error)
            callback(error);
        else {
            the_collection.find().toArray(function (error, results) { //B
                if (error)
                    callback(error);
                else
                    callback(null, results);
            });
        }
    });
};

//find a specific object
ListAccessDBDriver.prototype.get = function (collectionName, id, callback) { //A
    this.getCollection(collectionName, function (error, the_collection) {
        if (error)
            callback(error);
        else {
            var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$"); //B
            if (!checkForHexRegExp.test(id))
                callback({error: "invalid id"});
            else
                the_collection.findOne({'_id': ObjectID(id)}, function (error, doc) { //C
                    if (error)
                        callback(error);
                    else
                        callback(null, doc);
                });
        }
    });
};

//find a specific Team
ListAccessDBDriver.prototype.getTodosForList = function (specificList, callback) { //A
    var collectionName = 'todos';
    this.getCollection(collectionName, function (error, the_collection) {
        if (error) {
            callback(error);
        } else {
            the_collection.find({"belongstolist" : specificList}).toArray(function (err, docs) {
                //console.log(docs);
                callback(null,docs);
            });
        }
    });
};

//save new object
ListAccessDBDriver.prototype.save = function (collectionName, obj, callback) {
    this.getCollection(collectionName, function (error, the_collection) { //A
        if (error)
            callback(error);
        else {
            obj.created_at = new Date(); //B
            the_collection.save(obj, function (err, saved) { //C
                callback(null, obj);
            });
        }
    });
};

//update a specific object
ListAccessDBDriver.prototype.update = function (specificlist, todoname, callback) {
//    console.log(specificlist+"... "+todoname);
    this.getCollection('todos', function (error, the_collection) { //A
        if (error)
            callback(error);
        else {
            the_collection.insertOne(
                    {"name":todoname,
                     "belongstolist":specificlist,
                     "doneflag":"0"
                    }
            );
        }
    });

};
ListAccessDBDriver.prototype.updateListType = function (specificlist, type) {
//    console.log(specificlist+"... "+type);
    var t='own';
    this.getCollection('list', function (error, the_collection) {
        if (error)
            callback(error);
        else {
            the_collection.find({"_id":ObjectID(specificlist)}).toArray(function (err, docs) {
                t=docs[0].type;
            });
            console.log("-->"+t);
            if(t==='public'){
                the_collection.update({"_id":ObjectID(specificlist)},{ $set: { "type":'own'}});
            }else{
                the_collection.update({"_id":ObjectID(specificlist)},{ $set: { "type":'public'}});
            }
            
            
            
            //the_collection.update({"name":specificlist},{ $set: { "type":'own'}});
//            var rslt = the_collection.find({"belongstolist":specificlist});
//            console.log(""+rslt);
//            the_collection.update({"name":specificlist},{ $set: { "type":'public'}});
            
            
        }
    });

};
ListAccessDBDriver.prototype.updateCheckbox = function (todoname, state, callback) {
//    console.log(todoname+"... "+state);
    this.getCollection('todos', function (error, the_collection) {
        if (error)
            callback(error);
        else {
            the_collection.update({"_id":ObjectID(todoname)},{ $set: { "doneflag":state}}, function(error, results) {
                //console.log(error);
                //console.log(results);
            });
        }
    });

};
//delete a specific object
ListAccessDBDriver.prototype.delete = function (collectionName, entityId, callback) {
    this.getCollection(collectionName, function (error, the_collection) { //A
        if (error)
            callback(error);
        else {
            the_collection.remove({'_id': ObjectID(entityId)}, function (error, doc) { //B
                if (error)
                    callback(error);
                else
                    callback(null, doc);
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

