'use strict';

var React = require('react'),

    Footer = React.createClass({
      render: function() {
        return (
          <footer role="toolbar">
            <button data-icon="edit"></button>
          </footer>
        );
      }
    });

module.exports = Footer;
