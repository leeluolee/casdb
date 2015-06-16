
var operator = require('../src/operator.js');
var projection = operator.projection;
var expect = require('expect.js')
var query = operator.query;


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
      expect( query.$exists(false)(null)).to.equal(true)
      expect( query.$exists(true)(1)).to.equal(false)
    })

    it('Logic query $or should work as expect', function(){
      
    })

  })

})