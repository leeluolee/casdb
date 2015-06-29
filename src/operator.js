
var helper = require('./helper');
var npself = function(item) {return item}
var isTrue = function() {return true}
// var isFalse = function() {return false}



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

  var equal = queries.$eq(value, vtype);
  return function(item){
    item = accessor(item);
    return equal(item)
  }
}

// { type: 'post', age: {$lt: name}}

var buildAccessor = exports.buildAccessor =  function(field){

  var len = field.length;
  if(len === 1) return function(item){ return item[field]}
  return function(item){
    for(var i = 0;  i < len ; i++){
      item = item == undefined? undefined:  item[field[i]];
    }
    return item;
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
      case 'regexp': 
        return function( item ){
          return value.test(item);
        }
      default: 
        return function( item ){
          return helper.deepEqual(item, value);
        }
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
  // "$text": function(){
  //   //@TODO....
  // },

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
  // "$all": function( value ){

  // },

  // Mocking Text
  // -------------
  // "$texting": function(value){
  //   return function(item){
  //     var type = typeof(item);
  //     if(type === 'string') return item.indexOf(value) !== -1
  //     if(type === 'object'){
  //       for(var i in item){
  //         if(typeof item[i] === 'string' && item[i].indexOf(value) !== -1) return true;
  //       }
  //     }
  //     return false
  //   }
  // },

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

// // Array modify
// var modify = exports.modify = {
//   "$each": function(array){
//     return function(value){
//       return value.push.apply(value, array);
//     }
//   },
//   "$sort": function(obj){
//     var keys= obj && Object.keys(obj)
//     var key = keys[0];
//     return function(){
//       return function(){

//       }
//     }
//   }
// }



var assignment = {
  // Basic
  assign: function(obj, key, fn){
    return fn(obj, key);
  },
  unset: function(obj, key, value){
    // @TODO: use delete ?
    obj[key] = undefined;
  },
  set: function(obj, key, value){
    obj[key] = value;
  },
  inc: function(obj, key, value){
    obj[key] += value;
  },
  mul: function(obj, key, value){
    obj[key] *= value;
  },
  rename: function(obj, key, value){
    obj[value] = obj[key];
    obj[key] = undefined;
  },
  min: function( obj, key, value ){
    if(obj[key] > value) obj[key] = value;
  },
  max: function( obj, key ,value ){
    if(obj[key] < value) obj[key] = value;
  },
  // Array
  pop: function( obj, key ,value ){
    var list = obj[key];
    if(value === -1) list.shift();
    if(value === 1) list.pop();
  },
  push: function( obj, key ,value ){
    if(helper.hasExpr(value)){
      var each, sort, slice, position;
      var list = obj[key];
      if((each = value.$each) && Array.isArray(each)){
        each.forEach(function(item){
          list.push(item);
        })
      }
      if(slice = value.$slice){
        var sliceFn = projection.$slice(slice);
        list = obj[key]= sliceFn(list);
      }
      if(sort = value.$sort){
        var fn = typeof sort === 'function'? sort: function(a, b){
          return sort > 0 ? a-b: b-a;
        }
        list.sort(fn)
      }
    }else{
      var list = obj[key];
      list.push( value );
    }
  },
  pushAll: function(){

  },
  pull : function(obj, key, query){
    var filter = !helper.hasExpr(query)? function(item){
        return helper.deepEqual(item, query)
      }: buildQueries(query)

    obj[key] = obj[key].filter(function(item){
      return !filter(item)
    })
  },
  pullAll : function(obj, key, query){
    if(Array.isArray(query)){
      obj[key] = obj[key].filter(function(item){
        return !~query.indexOf(item)
      })
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

function assignField(host, key, value, operation){

  if( ~key.indexOf('.') ){
    var pathes = key.split('.');
    var len = pathes.length;
    for(var i = 0; i < len-1 ; i++){
      host = host[ pathes[i] ];
    }
    key = pathes[len-1];
  }
  if(operation){
    operation(host, key, value)
  }else{
    host[key] = value;
  }
}
var update = exports.update = { } 
// dynamic generate
Object.keys(assignment).forEach(function(item){
  update["$" + item] = function(expression){
    return assignObject(expression, assignment[item])
  }
})
