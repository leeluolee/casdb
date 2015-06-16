

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
  log: function(msg, level){
    console.log(msg)
  }

}

  function objEquiv (a, b) {
    if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
      return false;
    //equivalent values for every corresponding key, and
    //~~~possibly expensive deep test
    return true;
  }
