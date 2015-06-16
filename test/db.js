

var Collection = require('../src/collection.js');
var DB = require('../src/casdb.js');
var expect = require('expect.js');
var libPath = require('path');
var path = require('path');
var fs = require('fs');




describe('CasDB', function(){



  it('sync should write whote json to file', function(done){

    var json = { posts: [ {_id: 0, time:1} ] }
    var filename = libPath.join( __dirname, 'data/db.json' );
    fs.writeFileSync(filename, JSON.stringify(json), 'utf8')
    var db = new DB( filename );
    expect(db.posts).to.equal(db.collection('posts'));
    db.posts.list.push({_id: 1, time: 2})
    json.posts.push({_id: 1, time: 2})
    db.sync();
    db.once('sync' , function(){
      expect(fs.readFileSync(filename, 'utf8')).to.equal(
        "{\n  \"posts\":[\n    {\"_id\":0,\"time\":1},\n    {\"_id\":1,\"time\":2}\n  ]\n}"
      )
      done()
    })
  })



  it('collection("xx") will created collection implicitly, if it is not exsits' , function(){

    var db = new DB( 'data/db2.json' );

    expect(db.posts).to.equal(undefined);

    var collection = db.collection( 'posts' );

    expect(db.posts).to.be.an(Collection);
    expect(db.posts).to.be.equal(collection);


    var col2 = db.collection('posts');


    expect(col2).to.equal(collection);

    var col3 = db.collection('posts', []);

    // not affect 
    expect(col3).to.equal(collection);

  })


  after(function(){
    fs.readdir(path.join(__dirname, './data'), function(error, filenames){
      filenames.forEach(function( filename ){
        if(path.extname(filename) === '.json'){
          fs.unlink( path.join(__dirname, 'data' , filename), function(err){
            if(err) throw err
          })
        }
      })
    }) 
  })

})