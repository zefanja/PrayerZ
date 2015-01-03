var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var TagConstants = require('../constants/TagConstants');
var PrayerConstants = require('../constants/PrayerConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _tags = JSON.parse(localStorage.getItem("tags")) || {};
var _lastIds = [];

/**
* Create a Tag item.
* @param {string} text The content of the Tag
*/
function create(text) {
  // Using the current timestamp + random number in place of a real id.
  var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  var exist = false;
  for (var i in _tags) {
    if(_tags[i].text === text) {
      exist = true;
      return i;
    }
  }

  if(!exist) {
    _tags[id] = {
      id: id,
      text: text
    };
    return id;
  }
}
/**
* Update a Tag item.
* @param {string} id
* @param {object} updates An object literal containing only the data to be
* updated.
*/
function update(id, updates) {
  _tags[id] = assign({}, _tags[id], updates);
}
/**
* Update all of the Tag items with the same object.
* the data to be updated. Used to mark all Tags as completed.
* @param {object} updates An object literal containing only the data to be
* updated.
*/
function updateAll(updates) {
  for (var id in _tags) {
    update(id, updates);
  }
}
/**
* Delete a Tag item.
* @param {string} id
*/
function destroy(id) {
  delete _tags[id];
}
/**
* Delete all the completed Tag items.
*/
function destroyCompleted() {
  for (var id in _tags) {
    if (_tags[id].complete) {
      destroy(id);
    }
  }
}

function save () {
  localStorage.setItem("tags", JSON.stringify(_tags));
}

var TagStore = assign({}, EventEmitter.prototype, {
  /**
  * Tests whether all the remaining Tag items are marked as completed.
  * @return {boolean}
  */
  areAllComplete: function() {
    for (var id in _tags) {
      if (!_tags[id].complete) {
        return false;
      }
    }
    return true;
  },

  /**
  * Get the entire collection of Tags.
  * @return {object}
  */
  getAll: function() {
    return _tags;
  },

  getAllTagText: function () {
    var tagNames = "";
      for (var i in _tags) {
        tagNames += (tagNames === "") ? _tags[i].text : ", " + _tags[i].text;
      }
    return tagNames;
  },

  getTagText: function (inTags) {
    var tagNames = "";
    if(inTags) {
      inTags.forEach(function (i) {
        tagNames += (tagNames === "") ? _tags[i].text : ", " + _tags[i].text;
      });
    }
    return tagNames;
  },

  getTagIds: function (inText) {
    var tags;
    var result = [];
    if (inText && inText !== '') {
      tags = inText.split(",");
      tags.forEach(function (t) {
        for (var key in _tags) {
          if (_tags[key].text === t.trim().toLowerCase()) {
            result.push(key);
          }
        }
      });
    }
    return result;
  },

  getLastIds: function () {
    return _lastIds;
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
TagStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;
  var text;
  var tags;
  var id;

  switch(action.actionType) {
    case TagConstants.TAG_CREATE:
    case PrayerConstants.PRAYER_CREATE:
      _lastIds = [];
      text = action.tags;
      if (text !== '') {
        tags = text.split(",");
        tags.forEach(function (t) {
          id = create(t.trim().toLowerCase());
          if(id) {
            _lastIds.push(id);
          }
        });
      }
      break;
    case TagConstants.TAG_UPDATE_TEXT:
      text = action.text.trim();
      if (inText && inText !== '') {
        update(action.id, {text: text});
      }
      break;
    case TagConstants.TAG_DESTROY:
      destroy(action.id);
      break;
    default:
      return true;
  }
  // This often goes in each case that should trigger a UI change. This store
  // needs to trigger a UI change after every view action, so we can make the
  // code less repetitive by putting it here. We need the default case,
  // however, to make sure this only gets called after one of the cases above.
  TagStore.emitChange();
  return true; // No errors. Needed by promise in Dispatcher.
});

module.exports = TagStore;