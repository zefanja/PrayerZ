var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var DONE_EVENT = 'done';

var uiEvents = assign({}, EventEmitter.prototype, {
  emitDone: function() {
    this.emit(DONE_EVENT);
  },
  /**
  * @param {function} callback
  */
  addDoneListener: function(callback) {
    this.on(DONE_EVENT, callback);
  },

  /**
  * @param {function} callback
  */
  removeDoneListener: function(callback) {
    this.removeListener(DONE_EVENT, callback);
  },

  done: function () {
    this.emitDone();
  }
});

module.exports = uiEvents;