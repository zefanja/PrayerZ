/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * TodoStore
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var PageConstants = require('../constants/PageConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _pages = {
  "main": {visible:true, id: "main"},
  "add": {visible:false, id: "add"},
  "settings": {visible:false, id: "settings"},
  "about": {visible:false, id: "about"}
};

/**
 * Update a TODO item.
 * @param  {string} id
 * @param {object} updates An object literal containing only the data to be
 *     updated.
 */
function update(id, updates) {
  _pages[id] = assign({}, _pages[id], updates);
}

var PageStore = assign({}, EventEmitter.prototype, {

   /**
   * Get the entire collection of PAGEs.
   * @return {object}
   */
  getAll: function() {
    return _pages;
  },

  getActive: function() {
    for (var id in _pages) {
      if(_pages[id].visible) {
        return _pages[id];
      }
    }
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register to handle all updates
AppDispatcher.register(function(payload) {
  var action = payload.action;
  var text;

  switch(action.actionType) {
    case PageConstants.PAGE_VISIBLE:
      update(action.id, {visible: action.visible});
      break;
    case PageConstants.PAGE_ACTIVE:
      getActive();
      break;
    default:
      return true;
  }

  // This often goes in each case that should trigger a UI change. This store
  // needs to trigger a UI change after every view action, so we can make the
  // code less repetitive by putting it here.  We need the default case,
  // however, to make sure this only gets called after one of the cases above.
  TodoStore.emitChange();

  return true; // No errors.  Needed by promise in Dispatcher.
});

module.exports = PageStore;
