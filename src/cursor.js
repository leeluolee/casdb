

var operator = require('./operator');
var helper = require('./helper');
var queries = operator.queries;


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







var co = Cursor.prototype;


co.query = function( queries ){
  this.queries.push(operator.buildQueries( queries ));
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