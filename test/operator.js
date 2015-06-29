
var operator = require('../src/operator.js');
var projection = operator.projection;
var expect = require('expect.js')
var query = operator.queries;
var projection = operator.projection;
var update = operator.update;


describe("Operator", function(){

  describe("Operator.query", function(){

    it("$eq should work", function( ){
      expect(query.$eq('tag')('tag')).to.equal(true)
      expect(query.$eq('tag')(['tag', 'tag1'])).to.equal(true)
      expect(query.$eq(['tag', 'tag2'])('tag')).to.equal(false)
      expect(query.$eq(['tag', 'tag2'])(['tag', 'tag2'])).to.equal(true)

      expect(query.$eq({name: 1, age: 2})({name: 1, age:2})).to.equal(true)
    })

    it("$gt, $gte, $ne, $lt, $lte should work", function(){
      expect( query.$gt(1)(2) ).to.equal(true)
      expect( query.$gt(2)(1) ).to.equal(false)
      expect( query.$lt(1)(2) ).to.equal(false)
      expect( query.$lt(2)(1) ).to.equal(true)
      expect( query.$gte(1)(1) ).to.equal(true)
      expect( query.$lte(1)(1) ).to.equal(true)
      expect( query.$ne(1)(1) ).to.equal(false)
      expect( query.$ne(1)(2) ).to.equal(true)
      expect( query.$ne({})(2) ).to.equal(true)
    })

    it("$in, $nin, $exists should work", function(){
      expect( query.$in([1,2,3])(2)).to.equal(true)
      expect( query.$in([1,2,3])(4)).to.equal(false)
      expect( query.$nin([1,2,3])(4)).to.equal(true)
      expect( query.$nin([1,2,3])(2)).to.equal(false)
      expect( query.$exists(true)(undefined)).to.equal(false)
      expect( query.$exists(false)(null)).to.equal(false)
      expect( query.$exists(true)(1)).to.equal(true)
    })

    it("$regexp should work", function(){

      expect( query.$regexp(/name/)('name2')).to.equal(true)
      expect( query.$regexp(/name/)('daame2')).to.equal(false)
      expect( query.$regexp('name')('aname3ada')).to.equal(true)

    })
    it("$size should work", function(){

      expect( query.$size(10)('name2name2')).to.equal(true)
      expect( query.$size(2)([1,2])).to.equal(true)
      expect( query.$size(9)('name2name2')).to.equal(false)
      expect( query.$size(1)([1,2])).to.equal(false)

    })
    it("$where should work", function(){

      expect( query.$where('obj > 6')(7)).to.equal(true)
      expect( query.$where('this.a > 6')({a:9})).to.equal(true)
      expect( query.$where(function(item){return item > 6 && item < 8})(7)).to.equal(true)
      expect( query.$where(function(item){return item > 6 && item < 8})(6)).to.equal(false)
      expect( query.$where(function(item){return item > 6 && item < 8})(6)).to.equal(false)

    })
    it("$mod should work", function(){

      expect( query.$mod([4,1])(13)).to.equal(true)
      expect( query.$mod([4,1])(14)).to.equal(false)
      expect( query.$mod([4,0])(12)).to.equal(true)
      expect( query.$mod([4,0])(13)).to.equal(false)

    })
    it("$elemMatch should work", function(){

      expect( query.$elemMatch({$gt: 7, $lt: 9})([8,10,11])).to.equal(true)
      expect( query.$elemMatch({$gt: 7, $lt: 9})([18,10,11])).to.equal(false)

    })

    it('Logic $or should work as expect', function(){
       
      expect( query.$or([{$gt: 1}, { $eq: 0 }])(0) ).to.equal(true)
      expect( query.$or([{$gt: 1}, { $eq: 0 }])(-1) ).to.equal(false)

    })
    it('Logic $and should work as expect', function(){
       
      expect( query.$and([{$gt: 1}, { $lt: 4 }])( 6) ).to.equal(false)
      expect( query.$and([{$gt: 1}, { $lt: 4 }])( 3) ).to.equal(true)
    })
    it('Logic $nor should work as expect', function(){
       
      expect( query.$nor([{$gt: 1}, { $lt: 4 }])( 6) ).to.equal(false)
      expect( query.$nor([{$gt: 1}, { $lt: 4 }])( 3) ).to.equal(false)
      expect( query.$nor([{$gt: 7}, { $lt: 4 }])( 6) ).to.equal(true)
    })
    it('Logic $not should work as expect', function(){
       
      expect( query.$not({$gt: 1})(6) ).to.equal(false)
      expect( query.$not(/name/)('danam') ).to.equal(true)

    })


    it("$comment should do nothing", function(){

      expect( query.$comment('This is a comment')(false)).to.equal(true)
      expect( query.$comment('This is a comment too')(true)).to.equal(true)

    })

  })

  describe("Operator.projection", function(){

    it("Array $elemMatch", function(){
      expect(projection.$elemMatch( { $gt: 0 } )([1,2,3,4,-1])).to.eql( [1,2,3,4])
    })

    it("Array $elemMatch", function(){
      expect(projection.$elemMatch( { $gt: 0 } )([1,2,3,4,-1])).to.eql( [1,2,3,4])
    })

    it("Array $slice", function(){
      expect(projection.$slice(2)([1,2,3,4,-1])).to.eql([1,2])
      expect(projection.$slice(-3)([1,2,3,4,-1])).to.eql([3,4,-1])
      expect(projection.$slice([-3, 2])([1,2,3,4,-1])).to.eql([3,4])
      expect(projection.$slice([3, 2])([1,2,3,4,-1])).to.eql([4,-1])
    })
  })

  describe("Operator.update", function(){

    it("$set simple", function(){
      var obj = {name: 100, age:10}
      update.$set({name: 200})(obj)
      expect( obj.name ).to.equal(200);
      expect( obj.age ).to.equal( 10);

    })
    it("$set depth", function(){

      var obj = {name: 100, age:10, family: {parent: 'job', mother: 'lily', children: { first: 'dabao' }}}
      update.$set({'family.parent': 'zhenghaibo'})(obj)
      expect( obj.family.parent ).to.equal('zhenghaibo');
      update.$set({'family.children.first': 'erbao'})(obj)
      expect( obj.family.children.first ).to.equal( 'erbao');
      expect( obj.family.mother ).to.equal('lily');
    })
    it("$set array", function(){

      var obj = { name: 'leeluolee', children: [{age:1, name:'铁蛋'}, {age:1, name: '铃铛'}] }

      update.$set({'children.0': {age:2, name: 'tiedan'}} )(obj)
      expect(obj.children[0]).to.eql({age:2, name: 'tiedan'})

      update.$set({ 'children.1.name': 'lingdang' } )(obj)
      expect( obj.children[1].name ).to.equal('lingdang')

    })

    it("$assign allow custom assignment on matched doc", function(){
      var obj = {name: 100, age:10, family: {mother: 'lily'}}
      update.$assign({name: function(obj, key){
        obj[key] = 1000
      }})(obj)
      expect(obj.name).to.equal(1000)
    })
    it("$unset simple, depth, array", function(){
      var obj = {name: 100, age:10, family: {mother: 'lily'}}
      update.$unset({name: ''})(obj)
      expect( obj.name ).to.equal(undefined);
      expect( obj.age ).to.equal( 10);
      update.$unset({'family.mother': ''})(obj)
      expect(obj.family.mother).to.equal(undefined);
    })
    it("$inc simple, depth, array", function(){
      var obj = {name: 100, age:10, family: {mother: 'lily'}}
      update.$inc({name: 2})(obj)
      expect( obj.name ).to.equal(102);
      update.$inc({name: -100})(obj)
      expect( obj.name ).to.equal(2);
    })
    it("$mul simple, depth, array", function(){
      var obj = {name: 100, age:10, family: {number: 1000}}
      update.$mul({name: 10})(obj)
      expect( obj.name ).to.equal(1000);
      update.$mul({name: 0.1})(obj)
      expect( obj.name ).to.equal(100);
      update.$mul({'family.number': 0.1})(obj)
      expect( obj.family.number ).to.equal(100);
    })
    it("$rename simple, depth, array", function(){
      var obj = {name: 100, age:10, family: {mother: 'lily'}}
      update.$rename({name: 'firstname'})(obj)
      expect( obj.name ).to.equal(undefined);
      expect( obj.firstname ).to.equal( 100);
      update.$rename({'family.mother': 'father'})(obj)
      expect(obj.family.mother).to.equal(undefined);
      expect(obj.family.father).to.equal('lily');
    })
    it("$min, $max simple, depth, array", function(){
      var obj = {name: 100, age:10, family: {mother: 'lily'}}
      update.$min({name: 10})(obj)
      expect( obj.name ).to.equal(10);
      update.$min({name: 11})(obj)
      expect( obj.age ).to.equal( 10);
      update.$max({name: 9})(obj)
      expect( obj.name ).to.equal(10);
      update.$max({name: 11})(obj)
      expect( obj.name ).to.equal(11);
    })

    // Array
    // 

    it("$pop should work", function(){
      var obj = {list: [1,2,3,4], nest: {list: [1,2,3,4]}}
      update.$pop({list: 1})(obj)
      expect(obj.list).to.eql([1,2,3])
      update.$pop({'nest.list': -1})(obj)
      expect(obj.nest.list).to.eql([2,3,4])
    })

    it("$pull should splice item form list", function(){
      
      var obj = {list: [1,2,3,4]}
      update.$pull({list: {$gt: 1, $lt: 3}})(obj)
      expect(obj.list).to.eql([1,3,4])
      var obj = {nest: {list: [1,2,3,4]} }
      update.$pull({'nest.list': 3})(obj)
      expect(obj.nest.list).to.eql([1,2,4])
      var obj = {nest: {list: [{name:1},2,3,4]} }
      update.$pull({'nest.list': {name:1}})(obj)
      expect(obj.nest.list).to.eql([2,3,4])

    })
    it("$pullAll should splice item form list when match the listed values", function(){

      var obj = {list: [1,2,3,4, 5,6,1,1,2]}
      update.$pullAll({list: [1,2]})(obj)
      expect(obj.list).to.eql([3,4,5,6])
      var obj = {nest: {list: [1,2,3,4,3]} }
      update.$pullAll({'nest.list': [3]})(obj)
      expect(obj.nest.list).to.eql([1,2,4])

      // @TODO
      // var obj = {nest: {list: [{name:1},2,3,4]} }
      // update.$pullAll({'nest.list': [{name:1}]})(obj)
      // expect(obj.nest.list).to.eql([2,3,4]ort

    })

    it("$push should work", function(){
      var obj = {list: [1,2,3,4], nest: {list: [1,2,3,4]}}
      update.$push({list: 1})(obj);
      expect(obj.list).to.eql([1,2,3,4,1]);
      update.$push({'nest.list': -1})(obj);
      expect(obj.nest.list).to.eql([1,2,3,4, -1]);
    })
    it("$push with each should work", function(){
      var obj = {list: [1,2,3,4], nest: {list: [1,2,3,4]}}
      update.$push({list: {$each: [2,3,4]}})(obj);
      expect(obj.list).to.eql([1,2,3,4,2,3,4]);
    })
    it("$push with $slice should work", function(){
      var obj = {list: [1,2,3,4], nest: {list: [1,2,3,4]}}
      update.$push({list: {$slice: 1}})(obj);
      expect(obj.list).to.eql([1]);
    })

    it("$push with $sort should work", function(){
      // @todo
      var obj = {list: [1,2,3,4], nest: {list: [1,2,3,4]}}
      update.$push({list: {$sort: 1}})(obj);
      expect(obj.list).to.eql([1,2,3,4]);
      update.$push({list: {$sort: -1}})(obj);
      expect(obj.list).to.eql([4,3,2,1]);

      update.$push({list: {$sort: function(a, b){
        if(b==1) return 1;
        else return -1;
      }}})(obj);
      expect(obj.list).to.eql([1, 4,3,2]);
    })
    it("$push with $sort, $slice and $each", function(){
      var obj = {list: [1,2,3,4], nest: {list: [1,2,3,4]}}
      update.$push({list: {$sort: -1, $each: [5,6]}})(obj);
      expect(obj.list).to.eql([6, 5, 4, 3, 2, 1]);
    })



  })

})










