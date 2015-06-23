
var operator = require('../src/operator.js');
var projection = operator.projection;
var expect = require('expect.js')
var query = operator.queries;


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
      expect( query.$nor([{$gt: 1}, { $lt: 4 }])( 3) ).to.equal(true)
    })
    it('Logic $not should work as expect', function(){
       
      expect( query.$not({$gt: 1})( 6) ).to.equal(false)
      expect( query.$not([{$gt: 1}, { $lt: 4 }])( 3) ).to.equal(true)
    })

    it('Logic not and or ', function(){
      
    })

    it("$comment should do nothing", function(){

      expect( query.$comment('This is a comment')(false)).to.equal(true)
      expect( query.$comment('This is a comment too')(true)).to.equal(true)

    })

  })

})