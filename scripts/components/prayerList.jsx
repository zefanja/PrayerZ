'use strict';

var PrayerItem = require('./prayerItem.jsx');
var React = require('react'),

    PrayerList = React.createClass({
      render: function() {
        var prayerItems = this.props.data.map(function (prayer) {
          return (
            <PrayerItem title={prayer.title} tags={prayer.tags} notes={prayer.notes}/>
          );
        });
        return (
          <section data-type="list" className="fit scroll">
            <header className="hide">{this.props.header}</header>
            <ul>
              {prayerItems}
            </ul>
          </section>
        );
      }
    });

module.exports = PrayerList;
