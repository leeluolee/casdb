
var expect = require('expect.js');
var Cursor = require('../src/cursor.js');
var Collection = require('../src/collection.js');
var async = require('async');




describe('Cursor', function(){


  describe("Cursor query", function(){
    var find = function(query, field){
      var cursor = new Cursor(collection, query);
      if(field) cursor.projection(field);
      return cursor.toArray.bind(cursor);
    }

    var collection = new Collection([
      {_id: 1, name: 'hzzhenghaibo0', users: ['a', 'b', 'c'], age: 12 , deep: {priority: 2, deep2: {son: 'hello'}}},
      {_id: 1, name: 'hzzhenghaibo5', users: ['a', 'b', 'c'], age: 12 , deep: {priority: 2}},
      {_id: 2, name: 'hzzhenghaibo1', users: ['d', 'f', 'e'], age: 22 , deep: {priority: 2} },
      {_id: 3, name: 'hzzhenghaibo2', users: ['f', 'g', 'k'], age: 32 , deep: {priority: 4, deep2: {son: 'hello'}}},
      {_id: 4, name: 'hzzhenghaibo3', users: ['w', 'q', 'x'], age: 42 , deep: {priority: 3}},
      {_id: 5, name: 'hzzhenghaibo4', users: ['u', 'o', 'p'], age: 52 , deep: {priority: 3}},
    ])
    it("cursor with regexp", function(done){
      var cursor = new Cursor(collection, {
        name: /hzzhenghaibo/
      })
      cursor.toArray(function(err, list){

        expect(list.length).to.eql(6);
        done();

      });

    })

    it("simple equal should work", function( done){

      var cursor = new Cursor(collection, {
        name: 'hzzhenghaibo0'
      })
      
      cursor.toArray(function(err, list){

        expect(list[0]).to.eql(collection.list[0]);
        done();
      });
    })

    it("query with operation should work", function(done){
      var cursor = new Cursor(collection, {
        name: {
          $where: 'return obj === "hzzhenghaibo0"'
        }
      })
      cursor.toArray(function(err, list){

        expect(list[0].name).to.equal('hzzhenghaibo0');
        done();
      });
    })
    it("query with multiply operation should work", function(done){
      var cursor = new Cursor(collection, {
        name: {
          $where: 'return obj.indexOf("hzzhenghaibo")===0',
          $ne: 'hzzhenghaibo0'
        }
      })
      cursor.toArray(function(err, list){

        expect(list.length).to.equal(5);
        done();
      });
    })

    it("query with limit", function(done){
      var cursor = new Cursor(collection, {
        name: {
          $where: 'return obj.indexOf("hzzhenghaibo")===0',
          $ne: 'hzzhenghaibo0'
        }
      }).limit(2)
      cursor.toArray(function(err, list){
        expect(list.length).to.equal(2);
        done();
      });

    })
    it("query with sort", function(done){
      var cursor = new Cursor(collection, {
        name: {
          $where: 'return obj.indexOf("hzzhenghaibo")===0',
          $ne: 'hzzhenghaibo0'
        }
      }).sort({age: -1});

      cursor.toArray(function(err, list){
        expect(list.length).to.equal(5);
        expect(list.map(function(item){
          return item._id
        })).to.eql([5,4,3,2,1]);
        done()
      });

      var cursor = new Cursor(collection, {
        name: {
          $ne: 'hzzhenghaibo0'
        }
      }).sort({name: -1});

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

    it("cursor with projection", function( done ){
      async.parallel([

        find({age: 22 }, {name:1, age:2} ),
        find({age: 22}, {name: 0, age:0, deep: 0}),
        find({age: 22 }, {name: 1, age:0, _id: 0})

      ], function(err, result){

        expect(result[0][0]).to.eql({_id: 2, name: 'hzzhenghaibo1',age:22});
        expect(result[1][0]).to.eql({_id: 2, users: ['d', 'f', 'e']});
        expect(result[2][0]).to.eql({name: 'hzzhenghaibo1'});
        done()

      })

    })



  })


  describe("Cursor projection", function(){
    it(" behavior purpose here", function( done){
      done()
    })
  })
})