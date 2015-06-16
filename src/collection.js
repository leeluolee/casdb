
var Emitter = require('eventemitter3');
var helper = require('./helper');
var util = require('util');


var noop = function(){};


function Collection( collection ){
  Emitter.call(this)
  this.list = collection || [];
}

util.inherits(Collection, Emitter);

var so = Collection.prototype;


// insert a document to collection
so.insert = function( doc, callback ){

  if( Array.isArray(doc) ){
    doc.forEach( this._insert.bind(this) )

  }else{
    this._insert( doc )

  }
  //notify writer
  this.emit('update', callback? callback.bind(this, doc) : noop );
}



so.find = function ( conditions, fileds, callback){
  var filter = this.cond2filter(conditions, fileds);
  var list = this.list;
  var result = [];
  for(var len = list.length; len-- ;){
    var test = filter(list[len]);
    switch(test){
      case 1: 
    }
  }
}


so.cond2filter = function (conds, fileds){
  for(var i in conds) if( conds.hasOwnProperty(i) ){
    var cond = conds[i];
    var typeOfCond = helper.typeOf(cond);

    if(typeOfCond === 'regexp') cond = { $regexp:  cond }
    if(i.indexOf())
    switch( i ){
      case "$lt": 
      case "$lte": 
      case "$gt": 
      case "$gte": 
      case "$in": 
      case "$nin": 
      case "$ne": 
      case "$exists": 
      case "$regex":

      default: // Equality 
    }
  }
}

// find with limit 1;
so.findOne = function(conditions){

}

so.remove = function( conditions, callback){

}


so.update = function(conditions, callback){

}

so.count = function(){

}

so.json = function(){
  return this.list;
}


so._insert = function(doc){
  doc._id = helper.id(); // hex random string.
  doc.create_at = +new Date;
  doc.update_at = +new Date;
  this.list.push(doc);
}


module.exports = Collection;









