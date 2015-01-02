var AppDispatcher = require('../dispatcher/AppDispatcher');
var TagConstants = require('../constants/TagConstants');

var TagActions = {
	/** * @param {string} text */
	create: function(tags) {
		AppDispatcher.handleViewAction({
			actionType: TagConstants.TAG_CREATE,
			tags: tags
		});
	},

	destroy: function(id) {
		AppDispatcher.handleViewAction({
			actionType: TagConstants.TAG_DESTROY,
			id: id
		});
	},
};

module.exports = TagActions;