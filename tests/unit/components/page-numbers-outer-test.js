import Ember from 'ember';
import { test, moduleForComponent } from 'ember-qunit';
import PagedArray from 'ember-cli-pagination/local/paged-array';
import PageNumbersInnerComponent from '../../../components/page-numbers-inner';

var makePagedArray = function(list) {
  return PagedArray.create({content: list, perPage: 2, page: 1});
};

moduleForComponent("page-numbers-outer", "PageNumbersOuterComponent", {
  needs: ["component:page-numbers-inner"]
});

var paramTest = function(name,ops,f) {
  test(name, function() {
    var subject = this.subject();

    Ember.run(function() {
      Object.keys(ops).forEach(function (key) { 
          var value = ops[key];
          subject.set(key,value);
      });
    });

    f.call(this,subject,ops);
  });
};

var makeContainingObject = function(subject) {
  var containingObject = {
    doThing: function(n) {
      this.actionCounter++;
      this.clickedPage = n;
    },
    actionCounter: 0,
    clickedPage: null
  };

  subject.set('targetObject',containingObject);
  subject.set('action','doThing');

  return containingObject;
};

paramTest("smoke", {content: makePagedArray([1,2,3,4,5])}, function(outer,ops) {
  var containingObject = makeContainingObject(outer);

  var inner = PageNumbersInnerComponent.create({content: ops.content});
  inner.set('targetObject',outer);
  inner.set('action','pageClicked');

  equal(inner.get('totalPages'),3);
  Ember.run(function() {
    inner.send('pageClicked',2);
  });

  equal(ops.content.get('page'),2);
  equal(containingObject.actionCounter,1);
  equal(containingObject.clickedPage,2);
});

// setup an inner
// sets its action and parent to an outer
// set the same content on the inner and the outer
// trigger a pageClicked event on inner
// confirm page changes on content