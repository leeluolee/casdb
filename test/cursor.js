
var expect = require('expect.js');
var Cursor = require('../src/cursor.js');
var Collection = require('../src/collection.js');
var async = require('async');




describe('Cursor', function(){

  var collection = new Collection([
      {_id: 1, name: 'hzzhenghaibo0', users: ['a', 'b', 'c'], age: 12 , deep: {priority: 2, deep2: {son: 'hello'}}},
      {_id: 1, name: 'hzzhenghaibo5', users: ['a', 'b', 'c'], age: 12 , deep: {priority: 2}},
      {_id: 2, name: 'hzzhenghaibo1', users: ['d', 'f', 'e'], age: 22 , deep: {priority: 2} },
      {_id: 3, name: 'hzzhenghaibo2', users: ['f', 'g', 'k'], age: 32 , deep: {priority: 4, deep2: {son: 'hello'}}},
      {_id: 4, name: 'hzzhenghaibo3', users: ['w', 'q', 'x'], age: 42 , deep: {priority: 3}},
      {_id: 5, name: 'hzzhenghaibo4', users: ['u', 'o', 'p'], age: 52 , deep: {priority: 3}},
    ])

  var find = function(query){
    var cursor = new Cursor(collection, query);
    return cursor.toArray.bind(cursor);
  }
  describe("Cursor query", function(){

    it("simple equal should work", function( done){

      var cursor = new Cursor(collection, {
        name: 'hzzhenghaibo0'
      })
      
      cursor.toArray(function(err, list){

        expect(list[0]).to.eql(collection.list[0]);
        done();
      });
    })

    it("simple equal with array", function( done){

     async.parallel([

       find( {users: 'a'} ),
       find( {users: ['d', 'f' , 'e']} ),
       find( {users: ['d', 'f' ]} ),
       find( {name: ['hzzhenghaibo0', 'hzzhenghaibo1' ]} )

     ], function(err, result){

      expect(result[0]).to.eql(collection.list.slice(0,2));
      expect(result[1]).to.eql([collection.list[2] ]);
      expect(result[2]).to.eql([])
      expect(result[3]).to.eql([])

      done()
     });

    })

    it("deep equal should work as expect", function(done){

      var cursor = new Cursor(collection, {
        'deep.priority': 2
      })

      var cursor2 = new Cursor(collection, {
        deep: {
          priority: 2
        },
        'deep.deep2.son': 'hello'
      })

      async.parallel([

        cursor.toArray.bind(cursor),
        cursor2.toArray.bind(cursor2)

      ], function(err, result){

        expect(result[0]).to.eql(collection.list.slice(0,3));
        expect(result[1]).to.eql(collection.list.slice(0,1));
        done()

      });
    })

    it("multi equal should work", function( done){

      var cursor = new Cursor(collection, {
        name: 'hzzhenghaibo0',
        age: 12
      })

      cursor.toArray(function(err, list){
        expect(list[0]).to.eql(collection.list[0]);
        done();
      });

    })

    it("$lt, $lte, $gt, $gte, $ne should work as expect", function(done){
    
      async.parallel([

        find({age: {$lt: 32}}),
        find({age: {$lte: 32}}),
        find({age: {$gt: 32}}),
        find({age: {$gte: 32}}),
        find({age: {$ne: 32}}),
        find({age: {$eq: 32}})

      ], function(err, result){

        expect(result[0]).to.eql(collection.list.slice(0,3));
        expect(result[1]).to.eql(collection.list.slice(0,4));
        expect(result[2]).to.eql(collection.list.slice(4));
        expect(result[3]).to.eql(collection.list.slice(3));
        var list = collection.list.slice()
        list.splice(3,1)
        expect(result[4]).to.eql(list);
        expect(result[5]).to.eql([collection.list[3]]);
        done()

      });


    })

    it("$in $nin should work with String or Array", function( done ){

      async.parallel([

        find({name: {$in: ['hzzhenghaibo0111'] }}),
        find({name: {$lte: 32}}),
        find({age: {$gt: 32}}),
        find({age: {$gte: 32}}),
        find({age: {$ne: 32}}),
        find({age: {$eq: 32}})

      ], function(err, result){

        // expect(result[0]).to.eql(collection.list.slice(0,3));
        // expect(result[1]).to.eql(collection.list.slice(0,4));
        // expect(result[2]).to.eql(collection.list.slice(4));
        // expect(result[3]).to.eql(collection.list.slice(3));
        // var list = collection.list.slice()
        // list.splice(3,1)
        // expect(result[4]).to.eql(list);
        // expect(result[5]).to.eql([collection.list[3]]);
        
        done()

      });

    })



  })


  describe("Cursor projection", function(){
    it(" behavior purpose here", function( done){
      done()
    })
  })
})