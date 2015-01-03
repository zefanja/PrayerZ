var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var PageConstants = require('../constants/PageConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';
var SETTINGS_EVENT = 'settings';

var _pages = {
  "main": {visible:true, id: "main"},
  "add": {visible:false, id: "add"},
  "settings": {visible:false, id: "settings"},
  "about": {visible:false, id: "about"},
  "edit": {visible: false, id: "edit"}
};

var _settings = JSON.parse(localStorage.getItem("settings")) || {};

function update(inId) {
  for (var id in _pages) {
    if(id === inId) {
      _pages[id].visible = true;
    } else {
      _pages[id].visible = false;
    }
  }
}

function updateSettings(id, updates) {
  _settings[id] = assign({}, _settings[id], updates);
}

function save () {
  localStorage.setItem("settings", JSON.stringify(_settings));
}

var PageStore = assign({}, EventEmitter.prototype, {

   /**
   * Get the entire collection of PAGEs.
   * @return {object}
   */
  getAll: function() {
    return _pages;
  },

  getSettings: function () {
    return _settings;
  },

  getActive: function() {
    for (var id in _pages) {
      if(_pages[id].visible) {
        return _pages[id];
      }
    }
  },

  getDaysOfWeekTags: function () {
    return _settings.daysOfWeek;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  emitSettings: function() {
    this.emit(SETTINGS_EVENT);
    save();
  },

  addSettingsListener: function(callback) {
    this.on(SETTINGS_EVENT, callback);
  },

  removeSettingsListener: function(callback) {
    this.removeListener(SETTINGS_EVENT, callback);
  }
});

// Register to handle all updates
AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.actionType) {
    case PageConstants.PAGE_SWITCH:
      update(action.id);
      PageStore.emitChange();
      break;
    case PageConstants.PAGE_UPDATE_SETTINGS:
      updateSettings(action.id, action.updates);
      PageStore.emitSettings();
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
  //PageStore.emitChange();

  return true; // No errors.  Needed by promise in Dispatcher.
});

module.exports = PageStore;
