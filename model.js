var mongo = require('mongodb').MongoClient;
var shortid = require('shortid');

function validateText(text) {
  if(text === undefined) throw new Error('text is undefined');
  if(typeof text !== 'string') new Error('text is not a string');
  if(text.length < 1) throw new Error('text is empty');
}

function validateUid(uid) {
  if(uid === undefined) throw new Error('uid is not defined');
  if(typeof uid !== 'string') throw new Error('uid is not a string');
  if(uid.length < 1) throw new Error('uid is empty');
}

module.exports = function(url, collection) {
  var db = null;

  var collPromise = new Promise(function(resolve, reject) {
    mongo.connect(url, function(err, db) {
      if (err) {
        reject(err);
        return;
      }
      db = db;
      resolve(db.collection(collection));
    });
  });

  this.findAll = function() {
    return collPromise.then(function(collection) {
      console.log('loading all');
      return collection.find().toArray();
    });
  }

  this.insert = function(text) {
    return collPromise.then(function(collection) {
      var task = {};
      task._id = shortid.generate();
      task.text = text;
      task.done = false;
      console.log('inserting', task);
      validateText(text);
      return collection.insertOne(task);
    });
  }

  this.update = function(uid, task) {
    return collPromise.then(function(collection) {
      console.log('updating', uid, task);
      validateUid(uid);
      validateText(task.text);
      return collection.updateOne({_id: uid}, {$set: task});
    });
  }

  this.delete = function(uid) {
    return collPromise.then(function(collection) {
      console.log('deleting', uid);
      validateUid(uid);
      return collection.deleteOne({_id: uid});
    })
  }

  this.closeConnection = function() {
    if(db) db.close();
  }

  return this;
}
