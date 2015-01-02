'use strict';
var React = require('react'),

    Footer = React.createClass({
      render: function() {
        var node;
        if(this.props.editMode) {
          node =  <footer role="toolbar">
                    <button data-icon="delete"></button>
                    <button data-icon="tick"></button>
                  </footer>;
        } else {
          node =  <footer role="toolbar">
                    <button data-icon="edit" onClick={this.props.onEditMode}></button>;
                  </footer>;
        }
        return (
          node
        );
      }
    });

module.exports = Footer;
