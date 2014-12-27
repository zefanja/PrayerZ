'use strict';

var React = require('react'),

    PrayerItem = React.createClass({
      render: function() {
        return (
          <li>
            <div>{this.props.title}</div>
            <div className="small">{this.props.notes}</div>
          </li>
        );
      }
    });

module.exports = PrayerItem;
