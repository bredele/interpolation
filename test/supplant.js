var supplant = require('supplant');
var assert = require('assert');

function Store(data){
  var _data = data;
  this.set = function(name, value) {
    _data[name] = value;
  };
  this.get = function(name){
    return _data[name];
  };
};


describe('string interpolation', function(){
  var store = null;
  beforeEach(function(){
    store = new Store({
      test : 'awesome'
    });
  });

  it('should support initialization', function(){
    var str = "This is an {test} interpolation";
    var result = supplant(str, store);
    assert('This is an awesome interpolation' === result.text);
  });

  it('should return an empty string if the interpolation doesn\'t exist', function(){
    var str = "This is an {something} interpolation";
    var result = supplant(str, store);
    assert('This is an  interpolation' === result.text);
  });

  it('should ignore whitespace', function(){
    var str = "This is an { test   } interpolation";
    var result = supplant(str, store);
    assert('This is an awesome interpolation' === result.text);
  });

  it('should support mutiple interpolation', function(){
    var str = "This is an {test} interpolation made by {name}";
    store.set('name', 'Bredele');
    var result = supplant(str, store);
    assert('This is an awesome interpolation made by Bredele' === result.text);
  });
});

// describe('handlebars', function() {
//   it("should return the content of simple handlebars", function() {
//     var str = "{{test}}";
//     var result = supplant(str, {test:'bredele'});
//     assert(bredele === result);
//   });

// });

describe('interpolation attrs utils', function(){

  var store = null;
  beforeEach(function(){
    store = new Store({
      firstname : 'olivier',
      lastname:'wietrich',
      country: 'France',
      github:'bredele'
    });
  })

  it('should return an array of the store attributes', function(){

    var str = "{welcome} My name is {firstname} {lastname} and I love {country}";
    var props = supplant(str, store);
    assert('["welcome","firstname","lastname","country"]' === JSON.stringify(props.props));
  });

  it('should return a uniq array', function(){
    var str = "My github is {github} {github} and I love {country}";
    var props = supplant(str, store);
    assert('["github","country"]' === JSON.stringify(props.props));
  });

});

describe('interpolation magic', function(){
  it('should do some math', function(){
    var str = "This is simple math: { a + b }";
    var obj = {
      a : 2,
      b : 3
    };
    var result = supplant(str, obj);
    assert('This is simple math: 5' === result);
  });

  it('should manipulate a string', function(){
    var str = 'Hello { label.replace("w", "W") }';
    var obj = {
      label : 'world'
    };
    var result = supplant(str, obj);
    assert('Hello World' === result);
  });
  
});