

var MIN_INC = parseInt("10000", 16);
var MAX_INC = parseInt("fffff", 16);
var _inc = MIN_INC;
var o2str = ({}).toString

var helper = module.exports = {
  id: function(){
    if( ++_inc > MAX_INC) _inc = MIN_INC;
    return (+new Date).toString( 16 )  + (_inc).toString( 16 );
  },
  typeOf: function( o ){
    return o == null ? String(o) : o2str.call(o).slice(8, -1).toLowerCase();
  },
  hasExpr: function(obj){
    try{
      return Object.keys(obj).some(function(item){
        return item.indexOf('$') === 0
      })
    }catch(e){
      return false;
    }
  },
  deepClone: function(src){
    var type = helper.typeOf(src);
    var dest;
    switch(type){
      case 'object':
        var dest = {};
        for( var i in src ) if( src.hasOwnProperty(i) ){
          dest[i] = helper.deepClone( src[i] );
        }
        return dest;
      case 'array':
        var dest = [];
        for(var i = 0, len = src.length; i < len; i++){
          dest[i] = helper.deepClone(src[i]);
        }
        return dest;
      default: 
        return src;
    }
  },
  // expect.js sctrict equal
  deepEqual: function(actual, expected){
    if ( actual === expected ) {
      return true;
    }

    var etype = helper.typeOf(expected);
    var atype = helper.typeOf(actual);

    if ( etype === 'date' && atype === 'date' ) {
      return actual.getTime() === expected.getTime();
    } 

    if( etype !== 'object' && etype !== 'array' &&  
        atype !== 'object' && atype !== 'array' ) {
      return false;
    } 

    if( actual == null || expected == null) return false;

    try{
      var ka = Object.keys(actual),
        kb = Object.keys(expected),
        key, i;
    } catch (e) {
      return false;
    }
    if (ka.length != kb.length)
      return false;
    ka.sort();
    kb.sort();
    for (i = ka.length - 1; i >= 0; i--) {
      if (ka[i] != kb[i]) return false;
    }
    for (i = ka.length - 1; i >= 0; i--) {
      key = ka[i];
      if (!helper.deepEqual(actual[key], expected[key])) return false;
    }
    return true;
  },
  getSort : function( sign ){
    return typeof sign === 'function'? sign: 
      (sign > 0? function(a, b){ return a-b}: function(a, b){ return b-a})
  },
  compare: function(a, b){
    if(a < b) return -1;
    if(a > b) return 1;
    return 0;
  },

  log: function(msg, level){
    console.log(msg)
  }

}

