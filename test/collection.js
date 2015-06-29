

var expect = require('expect.js');
var Collection = require('../src/collection.js');


describe('Collection', function(){

  describe("Collection.insert", function(){
    var collection = new Collection();
    it("insert  single document", function(done){
      var inserted = {name: 'casdb1', age: 2};
      collection.insert( inserted, function(err, doc){
        expect(doc).to.not.equal(inserted);
        expect(doc.name).to.eql(inserted.name);
        collection.find({name:'casdb1'}, function(err, result){
          expect(result).to.eql([doc])
          done();
        })
      })
    })
    it("insert multipline document", function(done){
      var inserted = [{name: 'casdb2', age: 2}];
      collection.insert(inserted, function(err, doc){
        expect(doc.length).to.equal(1);
        expect(doc[0]).to.not.equal(inserted[0]);
        collection.find({name:'casdb2'}, function(err, result){
          expect(result).to.eql(doc)
          done();
        })
      })
    })
  })
  describe('Collection.find', function(){
    var collection = new Collection([
        {_id:1, name:1, age:1},
        {_id:2, name:'like', age:'hate'},
        {_id:3, name:'apple', age:'banana'}
      ]);

    it('find should accept regexp as cond', function(){


    })

  })

  describe("Collection.remove", function(){
    it(" behavior purpose here", function( ){
      expect().to.be.equal();
    })
  })

  describe("Collection.update", function(){
    it(" behavior purpose here", function( ){
      expect().to.be.equal();
    })
  })

})