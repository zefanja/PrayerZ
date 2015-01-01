var AppDispatcher = require('../dispatcher/AppDispatcher');
var PageConstants = require('../constants/PageConstants');

var PageActions = {
	/** * @param {string} text */
	setPage: function(id) {
		AppDispatcher.handleViewAction({
			actionType: PageConstants.PAGE_SWITCH,
			id: id
		});
	},

	getActive: function() {
		AppDispatcher.handleViewAction({
			actionType: PageConstants.PAGE_ACTIVE
		});
	},
};

module.exports = PageActions;