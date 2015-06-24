
var helper = require('./helper');
var npself = function(item) {return item}
var isTrue = function() {return true}
var isFalse = function() {return false}



var buildQueryList = function( expressions ){
  var len = expressions.length, rest = [];

  for( var i =0; i < len; i++ ) {
    rest.push(buildQueries(expressions[i]))
  }
  return rest;
}

var buildQueries = exports.buildQueries = function(ops, accessor){
  accessor = accessor || npself;
  var filters = [];

  for( var i in ops ){
    if(i.indexOf('$') === 0 && queries[i]) filters.push(queries[i](ops[i]))
    else{
      filters.push(exports.buildQuery(i, ops[i], accessor))
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



var buildQuery = exports.buildQuery = function(field, value){
  var type = helper.typeOf( field ), vtype = helper.typeOf( value );

  if( type === 'string' ){
    field = field.split( '.' );
  }

  var accessor = buildAccessor( field);

  if(vtype === 'object') return exports.buildQueries(value, accessor);

  else{
    var equal = queries.$eq(value, vtype);
    return function(item){
      item = accessor(item);
      return equal(item)
    }
  }
}

// { type: 'post', age: {$lt: name}}

var buildAccessor = exports.buildAccessor =  function(field){

  return function(item){

    for(var i = 0, len = field.length; i < len ; i++){
      item = item == undefined? undefined:  item[field[i]];
    }

    return item;
  }
}

var buildUpdate = exports.buildUpdator = function(expression){
  return function(host){
    for(var i in expression){

    }
  }
}

function assignObject(assignment, unset){
  return function(host){
    for(var i in assignment){
      assignField( host,  i , assignment[i], unset );
    }
  }
}

function assignField(host, key, value, unset){

  if( ~key.indexOf('.') ){
    var pathes = key.split('.');
    var len = pathes.length;
    for(var i = 0; i < len-1 ; i++){
      host = host[ pathes[i] ];
    }
    key = pathes[len-1];
  }
  if(unset){
    delete host[key]
  }else{
    host[key] = value
  }
}

var queries = exports.queries = {
  "$eq": function(value, type){

    var vtype = type || helper.typeOf(value);

    switch(vtype){
      case 'string':
      case 'number':
      case 'undefined':
      case 'null':
      case 'boolean':
        return function( item ){
          if( Array.isArray(item) ){
            return item.indexOf(value) !== -1;
          }else{
            return  item === value;
          }
        }
        break;
      default: 
        return function( item ){
          return helper.deepEqual(item, value);
        }
    }
    return function(item){
      return helper.deepEqual(value, item)
    }
  }, 
  "$lt": function(value){

    return function(item){
      return item < value;
    }
  },
  "$lte": function(value){

    return function(item){
      return item <= value;
    }
  },
  "$gt": function(value){
    return function(item){
      return item > value;
    }
  },
  "$gte": function(value){
    return function(item){
      return item >= value;
    }
  },
  "$ne": function(value){
    return function(item){
      return item !== value;
    }
  },
  "$in": function(value){
    return function(item){
      return value.indexOf(item) !== -1;
    }
  },
  "$nin": function(value){
    return function(item){
      return value.indexOf(item) === -1;
    }
  },
  "$exists": function( value){
    return function(item){
      return (typeof item === 'undefined') !== !!value;
    }
  },
  // Evaluation
  // --------
  "$regexp":function( value){
    if(typeof value === 'string') value = new RegExp( value );
    return function( item ){
      return value.test( item );
    }
  },
  "$where":function( value){
    if(typeof value === 'string') {
      value = new Function('obj', value.indexOf('return') === 0? value: 'return ' + value);
    }
    return function(item){
      return value.call(item, item);
    };
  },
  "$mod": function(value){
    return function( item ){
      return item % value[0] === value[1]
    }
  },
  "$text": function(){
    //@TODO....
  },

  // Array
  // ----------
  "$elemMatch":function( value){
    var matcher = buildQueries(value);
    return function(item){
      return item.some(matcher);
    }
  },
  "$size":function( value){
    value = parseInt(value, 10);
    return function(item){
      return (item && item.length) ===value;
    }
  },
  "$all": function( value ){

  },

  // Mocking Text
  // -------------
  "$texting": function(value){
    return function(item){
      var type = typeof(item);
      if(type === 'string') return item.indexOf(value) !== -1
      if(type === 'object'){
        for(var i in item){
          if(typeof item[i] === 'string' && item[i].indexOf(value) !== -1) return true;
        }
      }
      return false
    }
  },

  // Logic
  // -------------

  "$or":function( expressions){
    var builds = buildQueryList(expressions);
    return function(item){
      return builds.some(function(build){
        return build(item);
      })
    }
  },
  "$and":function( expressions){
    var builds = buildQueryList(expressions);
    return function(item){
      return builds.every(function(build){
        return build(item);
      })
    }
  },
  "$not": function( expression ){
    var filter;
    if( expression instanceof RegExp){
      return function(item){
        return !expression.test( item )
      }
    }else{
      filter =  buildQueries(expression);
      return function(item){
        return !filter(item)
      }
    }
  },
  "$nor": function( expressions ){
    var builds = buildQueryList(expressions);

    return function(item){
      return builds.every(function(build){
        return !build(item);
      })
    }
  },

  // Others
  // -----------

  "$comment": function(){
    return isTrue;
  }

}



var projection = exports.projection = {
  "$elemMatch": function(value){
    var filter = buildQueries(value)
    return function(list){
      return list.filter(filter);
    }
    
  },
  "$slice": function(action){
    var isArray = Array.isArray(action);
    return function(list){
      if(!isArray){
        return action > 0? list.slice(0, action): list.slice(action)
      }else{
        var skip = action[0];
        var limit = action[1];
        return  list.slice( skip , skip+limit  )
      }
    }
  }
}


var update = exports.update = {
  "$set": function(value){
    return assignObject(value);
  },
  "$unset": function(value){
    return assignObject(value, true)
  },
  "$inc": function(){

  },
  "$mul": function(){

  },
  "$rename": function(){

  },
  "$min": function(){

  },
  "$max": function(){

  },
  "$currentDate": function(){

  },
  // Array
  // ----------
  '$addToSet': function(){

  },
  '$pop': function(){},
  '$pullAll': function(){},
  '$pull': function(){},
  '$pushAll': function(){},
  '$push': function(){},

}