// the rewritten event expectation of jasmine-jquery 1.3.1

jasmine.JQuery = function() {};

(function(namespace) {
  var data = {
    spiedEvents: {},
    handlers:    []
  };

  namespace.events = {
    spyOn: function(selector, eventName) {
      var handler = function(e) {
        data.spiedEvents[[selector, eventName]] = e;
      };
      jQuery(selector).bind(eventName, handler);
      data.handlers.push(handler);
    },

    wasTriggered: function(selector, eventName) {
      return !!(data.spiedEvents[[selector, eventName]]);
    },

    cleanUp: function() {
      data.spiedEvents = {};
      data.handlers    = [];
    }
  }

  namespace.matchers = {
    toHaveBeenTriggeredOn: function() {
      return {
        compare: function(actual, selector) {
          var result = {};

          result.pass = jasmine.JQuery.events.wasTriggered(selector, actual);
          result.message = "Expected event " + actual + (result.pass ? " not" : "") + " to have been triggered on " + selector;

          return result;
        }
      };
    }
  };
})(jasmine.JQuery);

jasmine.spyOnEvent = function(selector, eventName) {
  jasmine.JQuery.events.spyOn(selector, eventName);
}

beforeEach(function() {
  jasmine.addMatchers(jasmine.JQuery.matchers);
});

afterEach(function() {
  jasmine.JQuery.events.cleanUp();
});
