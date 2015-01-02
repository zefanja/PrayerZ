'use strict';

var React = require('react'),

    PrayerItem = React.createClass({
      handleSelect: function (e) {
        this.props.onSelect({checked: e.target.checked, id: this.props.prayer.id});
      },

      render: function() {
        var prayer = this.props.prayer;
        return (
          <li>
            <label className="pack-checkbox">
              <input type="checkbox" onChange={this.handleSelect}/>
              <span></span>
            </label>
            <div>{prayer.title}</div>
            <div className="small">{prayer.text}</div>
            <div className="small">tags: {prayer.tags}</div>
          </li>
        );
      }
    });

module.exports = PrayerItem;
