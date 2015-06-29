

var operator = require('./operator');
var helper = require('./helper');
var queries = operator.queries;


function Cursor( collection, queries ){
  // related collection
  this.collection = collection;
  // query conditions
  this.queries = [];
  // projection conditions
  this._project = null;
  this._limit = null;
  this._skip = null;
  this._sort = null;
  this._index = 0;
  if(queries) this.query(queries);
}


var co = Cursor.prototype;


co.query = function( queries ){
  this.queries.push(operator.buildQueries( queries ));
}


co.each = co.forEach = function(fn){
  var list = this.collection.list, count = 0, skip = this._skip || 0, limit = this._limit; 
  var typeLimit = typeof limit;
  var raw = [];

  for(var i =0, len = list.length; i < len ; i++ ){
    if( this._test(list[i])) raw.push(list[i])
  }
  if( typeof this._sort === 'function'){
    raw.sort(this._sort)
  }
  for(var j = skip, len=limit? skip+limit: raw.length; j < len; j++ ){
      var item = raw[j];
      if(this._project) item = this._project(item);
      fn(item, j);
  }
  return this;
}

co.map = function(fn, callback){
  var result = [];
  this.each(function( item, index ){
    result.push( fn(item, index) )
  })
  return result;
}


co.projection = function( field ){
  this._project = function(item){
    var newDoc = {}, remain = false;
    for(var i in field){
      if(field[i] !== 0){
        remain = true;
        newDoc[i] = item[i] 
      }
    }
    if(remain === false){
      for(var i in item){
        if(field[i] !== 0){
          newDoc[i] = item[i]
        }
      }
    }
    if( field._id !== 0 ) newDoc._id = item._id;
    return newDoc
  }
}


co.sort = function(field){
  var stack = [];
  var keys = Object.keys(field);
  for(var i = 0, len = keys.length; i < len; i++){

    stack.push(function(i, sort){
      var acessor = operator.buildAccessor(i.split('.'));
      return function(a, b){
        var itema = acessor(a);
        var itemb = acessor(b);
        return sort(itema, itemb)
      }
    }( keys[i], helper.getSort(field[i]) ) )
  }
  this._sort = function(a, b){
    for(var i =0; i < len; i++ ){
      var ret = stack[i](a, b);
      if(ret) return ret;
    }
  }
  return this;
} 

co.skip = function(skipt){
  this._skip = parseInt(skip, 10);
  return this
}


co.limit = function(value){
  this._limit = parseInt(value, 10);
  return this;
}

// * private method *
// test item under current querylist
co._test = function(item){
  var queries = this.queries;
  for( var i = 0, len = queries.length; i < len; i++ ){
    if( !queries[i](item) ) return false;
  }
  return true;
}

co.toArray = function( callback ){
  callback(null, this.map(function(item){
    return helper.deepClone(item)
  }))
}


module.exports = Cursor;