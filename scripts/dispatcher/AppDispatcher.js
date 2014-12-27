var Dispatcher = require("flux").Dispatcher;
var assign = require('object-assign');

var AppDispatcher = assign(new Dispatcher(), {
  /**
  * @param {object} action The data coming from the view.
  */
  handleViewAction: function(action) {
    this.dispatch({
      source: 'VIEW_ACTION',
      action: action });
    }
  });

module.exports = AppDispatcher;