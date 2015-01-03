'use strict';
var uiEvents = require('../components/uiEvents');
var React = require('react'),

    Footer = React.createClass({
      _handleDelete: function () {
        uiEvents.destroy();
      },

      render: function() {
        var node;
        if(this.props.editMode) {
          node =  <footer role="toolbar">
                    <button data-icon="delete" onClick={this._handleDelete}></button>
                    <button data-icon="tick"></button>
                  </footer>;
        } else {
          node =  <footer role="toolbar" className={(this.props.hide) ? "hide" : ""}>
                    <div className="fit"></div>
                    <button data-icon="edit" onClick={this.props.onEditMode}></button>
                  </footer>;
        }
        return (
          node
        );
      }
    });

module.exports = Footer;
