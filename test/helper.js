
var expect = require('expect.js');

var helper = require('../src/helper.js');


describe("Helper", function(){
  it("helper.id should return 16-length hex string", function( ){
    expect(helper.id().length).to.be.equal(16);
  })
  it("helper.deepClone should clone", function( ){
    var src  = {
      obj1: {
        name: 1,
        arr1: [1, 2, 3]
      },
      arr2: [
        {name: 2, age: 3},
        1,
        2
      ],
      str: '1',
      num: 2,
      "null": null,
      "undefined": undefined,
      "function": function(){},
      "regexp": /abc/,
      'boolean': true
    }
    var clone = helper.deepClone( src );

    expect(clone.obj1).to.eql(src.obj1);
    expect(clone.obj1).to.not.equal(src.obj1);

    expect( clone.obj1.arr1 ).to.eql( src.obj1.arr1 );
    expect( clone.obj1.arr1 ).to.not.equal( src.obj1.arr1 );

    expect(clone.arr2).to.eql(src.arr2);
    expect(clone.arr2).to.not.equal(src.arr2);

    expect(clone.arr2[0]).to.eql(src.arr2[0]);
    expect(clone.arr2[0]).to.not.equal(src.arr2[0]);

    expect(clone.str).to.equal(src.str);
    expect(clone.num).to.equal(src.num);
    expect(clone.null).to.equal(src.null);
    expect(clone.undefined).to.equal(src.undefined);
    expect(clone.function).to.equal(src.function);
    expect(clone.boolean).to.equal(src.boolean);
    expect(clone.regexp).to.equal(src.regexp);

  })


  it("deepEqual should work as expect", function( ){
    expect(helper.deepEqual(['tag', 'tag2'], ['tag', 'tag2'])).to.equal(true);
    expect(helper.deepEqual({'tag':1}, {'tag':1})).to.equal(true);
    expect(helper.deepEqual({'tag':1, 'tag2': 2}, {'tag':1})).to.equal(false);
    expect(helper.deepEqual({'tag':1}, {'tag':1, 'tag2': 2})).to.equal(false);
  })
})