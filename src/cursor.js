
// case "$lt": 
// case "$lte": 
// case "$gt": 
// case "$gte": 
// case "$in": 
// case "$nin": 
// case "$ne": 
// case "$exists": 
// case "$regex":

// $or 
// $and
// $not
// $nor
// $exists
// $type

// $regex


var helper = require('./helper');
var npself = function(item){ return item};
var operator = require('./operator');
var queries = operator.query;


function Cursor( collection, queries ){
  // related collection
  this.collection = collection;
  // query conditions
  this.queries = [];
  // projection conditions
  this.projects = [];
  this.index = 0;
  if(queries) this.query(queries);
}



Cursor.buildQueries = function(ops, accessor){
  accessor = accessor || npself;
  var filters = [];

  for( var i in ops ){
    if(queries[i]) filters.push(queries[i](ops[i]))
    else{
      filters.push(Cursor.buildQuery(i, ops[i], accessor))
    }
  }
  var len = filters.length
  return function(item){
    for(var i = 0, len = filters.length ; i < len ; i++){
      if( !filters[i]( accessor(item)) ) return false;
    }
    return true
  }
}


Cursor.buildQuery = function(field, value){
  var type = helper.typeOf( field ), vtype = helper.typeOf( value );

  if( type === 'string' ){
    field = field.split( '.' );
  }

  var accessor = buildAccessor( field);

  if(vtype === 'object') return Cursor.buildQueries(value, accessor);

  else{
    var equal = queries.$eq(value, vtype);
    return function(item){
      item = accessor(item);
      return equal(item)
    }
  }
}

// { type: 'post', age: {$lt: name}}

var buildAccessor = Cursor.buildAccessor =  function(field){

  return function(item){

    for(var i = 0, len = field.length; i < len ; i++){
      item = item == undefined? undefined:  item[field[i]];
    }

    return item;
  }
}


var projects = Cursor.projects = {
  "$limit": function( value ){

    return function( item ){

    }
  },
  "$elemMatch": function( value ){

    return function( item ){

    }
  },

  "$slice": function( value ){

    return function( item ){

    }
  }
}



var co = Cursor.prototype;


co.query = function( queries ){
  this.queries.push(Cursor.buildQueries( queries ));
}

co.projection = function(){

}


co.sort = function(){


} 
co.skip = function(){

}


co.limit = function(value){
  this.limit = parseInt(value, 10);
}


co.projection = function(){

}

co.test = function(item){
  var queries = this.queries;
  for( var i = 0, len = queries.length; i < len; i++ ){
    if( !queries[i](item)) return false;
  }
  return true;
}

co.toArray = function( callback ){
  var result = [], list = this.collection.list, count=0;
  for(var i =0, len = list.length; i < len ; i++){
    if( this.test(list[i])){
      result.push(list[i]);
      if( ++count >= this.limit || this.limit === undefined ) break;
    }
  }
  if(!callback) return result;
  else callback(null, result);
}


module.exports = Cursor;