
var helper = require('./helper');

var query = exports.query = {
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
      return (typeof item === 'undefined') === !!value;
    }
  },
  "$regexp":function( value){
    if(typeof value === 'string') value = new Regexp( value );
    return function( item ){
      return value.test( item );
    }
  },
  // Array
  "$elemMatch":function( value){
    var matcher = Cursor.buildOperator(value);
    return function(item, index){
      return item.every(matcher);
    }
  },
  "$size":function( value){
    value = parseInt(value, 10);
    return function(item){
      return item.length ===value;
    }
  },
  "$filter":function( value){
    return function(item){
      return !!value(item);
    }
  },
  // Logic
  "$or":function( expressions){
    return function(item){
      return !!value(item);
    }
  }
}



var projection = exports.projection = { }