'use strict';

var PrayerItem = require('./prayerItem.jsx');
var TagStore = require('../stores/TagStore');

var React = require('react'),

    PrayerList = React.createClass({
      handleSelect: function (data) {
        console.log(data);
      },

      render: function() {
        var prayerItems = [];
        var allPrayers = this.props.data;
        //console.log(allPrayers);
        for (var id in allPrayers) {
          prayerItems.push(<PrayerItem prayer={allPrayers[id]} onSelect={this.handleSelect} />);
        }

        return (
          <section data-type="list" className="fit scroll">
            <header className="hide">{this.props.header}</header>
            <ul data-type={(this.props.editMode) ? "edit" : ""}>
              {prayerItems}
            </ul>
          </section>
        );
      }
    });

module.exports = PrayerList;
