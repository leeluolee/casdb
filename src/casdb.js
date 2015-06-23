
var Collection = require('./collection.js');
var Emitter = require('eventemitter3');
var fstorm = require('fstorm');
var path = require('path');
var helper = require('./helper');
var util = require('util');
var i = require('i');
var fs = require('fs');


function CasualDB( filename ){
  Emitter.call(this);
  this._collections = {};
  if(filename) this.attach( filename) ;
}


util.inherits(CasualDB, Emitter);

var co = CasualDB.prototype;


co.collection = function(name, collection ){
  if(helper.typeOf(name) === 'object'){
    for (var i in name){
      this.collection(i, name[i]);
    }
    return this;
  }
  var collections = this._collections;

  if( collections[name] ) return collections[name];
  if( !(collection instanceof Collection) ) collection = new Collection(collection || []);
  collections[name] = collection;

  Object.defineProperty(this, name, {
    get: function(){
      return collections[name];
    }
  })
  collection.on('update', this.sync.bind(this) );
  return collection;
}

co.hasCollection = function(name){
  return !!this._collections[name];
}

co.attach = function( filename ){
  filename = path.resolve( filename );
  this.filename = filename;
  this.writer = fstorm( this.filename );
  this.writer.on('end', this.emit.bind(this, 'sync'))
  try{
    var content = fs.readFileSync( filename, 'utf8' );
    var collections = JSON.parse( content );
  } catch(e){
    if(e.code === 'ENOENT') return;
    helper.log('[' + filename + '] has error: ' + e.message);
  }
  this.collection(collections)
}

co.json = function(){
  var cols = this._collections;
  var obj = {};
  var str = [ "{"  ];
  for( var i in cols) if( cols.hasOwnProperty(i) ){
    str.push("  \"" + i + "\":[")
    var list = cols[i].list;
    for(var j = 0, len = list.length ; j < len ;j++){
      str.push( "    " + JSON.stringify(list[j]) + (j === len-1? "" : ",") );
    }
    str.push("  ]")
  }
  str.push("}")
  return str.join("\n");
}


co.sync = function( ){
  var self = this;
  this.writer.write(function(){ return self.json() })
}



module.exports = CasualDB;









