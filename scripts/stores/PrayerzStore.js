var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var TodoConstants = require('../constants/PrayerzConstants');
var merge = require('react/lib/merge');

var CHANGE_EVENT = 'change';

var _prayers = {}; // collection of todo items

/**
* Create a TODO item.
* @param {string} text The content of the TODO
*/

function create(text) {
// Using the current timestamp in place of a real id.
	var id = Date.now();
	_prayers[id] = {
		id: id,
		complete: false,
		text: text
	};
}

/**
* Delete a TODO item.
* @param {string} id
*/

function destroy(id) {
	delete _prayers[id];
}

var TodoStore = merge(EventEmitter.prototype, {
	/** * Get the entire collection of TODOs.
	* @return {object}
	*/
	getAll: function() {
		return _prayers;
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
	},

	dispatcherIndex: AppDispatcher.register(function(payload) {
		var action = payload.action;
		var text;
		switch(action.actionType) {
			case TodoConstants.TODO_CREATE:
				text = action.text.trim();
				if (text !== '') {
					create(text);
					TodoStore.emitChange();
				}
				break;
			case TodoConstants.TODO_DESTROY:
				destroy(action.id);
				TodoStore.emitChange();
				break;
			// add more cases for other actionTypes, like TODO_UPDATE, etc.
		}
		return true; // No errors. Needed by promise in Dispatcher.
	})
});

module.exports = TodoStore;