
var Emitter = require('eventemitter3');
var operator = require('./operator');
var Cursor = require('./cursor');
var helper = require('./helper');
var util = require('util');


// var noop = function(){};


function Collection( collection ){
  Emitter.call(this)
  this.list = collection || [];
  this._insert = this._insert.bind(this)
}

util.inherits(Collection, Emitter);

var co = Collection.prototype;


// insert a document to collection
co.insert = function( doc, callback ){
  var ret;

  if( Array.isArray(doc) ){
    ret = doc.map( this._insert )
  }else{
    ret = this._insert( doc )
  }
  console.log(ret)
  //notify writer
  callback(null, ret);
  this.emit('update', ret );
}


co._insert = function(doc){
  // @TODO 
  doc = helper.deepClone(doc);
  doc._id = helper.id(); // hex random string.
  doc.create_at = +new Date;
  doc.update_at = +new Date;
  this.list.push(doc);
  return doc;
}


co.find = function(query, field, callback){
  if( typeof field === 'function' ) {
    callback = field;
    field = null;
  }
  var cursor = new Cursor(this, query);
  if(field) cursor.projection(filed);
  if(callback) return cursor.toArray(callback);
  return cursor;
}
// find with limit 1;
co.findOne = function(query, field, callback){
  var cursor = this.find(query, field).limit(1);
  if(callback) return cursor.toArray(function(err, result){
    callback(err, result[0])
  });
  return cursor;
}

/**
 * findAndModify 
 * @return {[type]} [description]
 */
co.findAndModify = function(){

}

co.remove = function(query, limit, callback){
  var list = this.list;
  if(limit === true) limit = 1;
  this.find(query, justOne).limit(limit).forEach(function(item , index){
    list.splice(index, 1)
  })
  return this;
}

co.drop = function(){
  this.list = [];
}

co.update = function(query, field, projection,  callback){
  this.find(query).forEach(function(item){

  })
}

co.count = function(query){
  var num  = 0;
  this.find(query).forEach(function(){
    num ++;
  })
}

co.json = function(){
  return this.list;
}



module.exports = Collection;










// co.cond2filter = function (conds, fileds){
//   for(var i in conds) if( conds.hasOwnProperty(i) ){
//     var cond = conds[i];
//     var typeOfCond = helper.typeOf(cond);

//     if(typeOfCond === 'regexp') cond = { $regexp:  cond }
//     if(i.indexOf())
//     switch( i ){
//       case "$lt": 
//       case "$lte": 
//       case "$gt": 
//       case "$gte": 
//       case "$in": 
//       case "$nin": 
//       case "$ne": 
//       case "$exists": 
//       case "$regex":

//       default: // Equality 
//     }
//   }
// }

// co