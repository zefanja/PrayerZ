var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var PrayerConstants = require('../constants/PrayerConstants');
var TagStore = require('../stores/TagStore');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _prayers = JSON.parse(localStorage.getItem("prayers")) || {}; // collection of Prayer items

/**
 * Create a Prayer item.
 * @param  {string} text The content of the Prayer
 */
function create(title, text, tagIds) {
  // Using the current timestamp + random number in place of a real id.
  var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  _prayers[id] = {
    id: id,
    complete: false,
    title: title,
    text: text,
    tags: tagIds
  };
}

/**
 * Update a Prayer item.
 * @param  {string} id
 * @param {object} updates An object literal containing only the data to be
 *     updated.
 */
function update(id, updates) {
  _prayers[id] = assign({}, _prayers[id], updates);
}

/**
 * Update all of the Prayer items with the same object.
 *     the data to be updated.  Used to mark all Prayers as completed.
 * @param  {object} updates An object literal containing only the data to be
 *     updated.

 */
function updateAll(updates) {
  for (var id in _prayers) {
    update(id, updates);
  }
}

/**
 * Delete a Prayer item.
 * @param  {string} id
 */
function destroy(ids) {
  ids.forEach(function (id) {
    delete _prayers[id];
  });
}

/**
 * Delete all the completed Prayer items.
 */
function destroyCompleted() {
  for (var id in _prayers) {
    if (_prayers[id].complete) {
      destroy(id);
    }
  }
}

function save () {
  localStorage.setItem("prayers", JSON.stringify(_prayers));
}

var PrayerStore = assign({}, EventEmitter.prototype, {

  /**
   * Tests whether all the remaining Prayer items are marked as completed.
   * @return {boolean}
   */
  areAllComplete: function() {
    for (var id in _prayers) {
      if (!_prayers[id].complete) {
        return false;
      }
    }
    return true;
  },

  /**
   * Get the entire collection of Prayers.
   * @return {object}
   */
  getAll: function() {
    return _prayers;
  },

  getByTagId: function (inIds) {
    var prayers = {};
    if(inIds) {
      for (var id in _prayers) {
        for (var i=0;i<inIds.length;i++) {
          if(_prayers[id].tags.indexOf(inIds[i]) !== -1) {
            prayers[id] = _prayers[id];
          }
        }
      }
    }
    return prayers;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
    save();
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
  var title;

  switch(action.actionType) {
    case PrayerConstants.PRAYER_CREATE:
      AppDispatcher.waitFor([TagStore.dispatchToken]);
      text = action.text.trim();
      title = action.title.trim();
      tagIds = TagStore.getLastIds();
      if (title !== '') {
        create(title, text, tagIds);
      }
      break;

    case PrayerConstants.PRAYER_TOGGLE_COMPLETE_ALL:
      if (PrayerStore.areAllComplete()) {
        updateAll({complete: false});
      } else {
        updateAll({complete: true});
      }
      break;

    case PrayerConstants.PRAYER_UNDO_COMPLETE:
      update(action.id, {complete: false});
      break;

    case PrayerConstants.PRAYER_COMPLETE:
      update(action.id, {complete: true});
      break;

    case PrayerConstants.PRAYER_UPDATE_TEXT:
      text = action.text.trim();
      title = action.title.trim();
      if (title !== '') {
        update(action.id, {title: title, text: text});
      }
      break;

    case PrayerConstants.PRAYER_DESTROY:
      destroy(action.ids);
      break;

    case PrayerConstants.PRAYER_DESTROY_COMPLETED:
      destroyCompleted();
      break;

    default:
      return true;
  }

  // This often goes in each case that should trigger a UI change. This store
  // needs to trigger a UI change after every view action, so we can make the
  // code less repetitive by putting it here.  We need the default case,
  // however, to make sure this only gets called after one of the cases above.
  PrayerStore.emitChange();

  return true; // No errors.  Needed by promise in Dispatcher.
});

module.exports = PrayerStore;
