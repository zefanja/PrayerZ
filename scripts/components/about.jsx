'use strict';

var React = require('react'),

    About = React.createClass({
      componentWillMount: function () {
        //this.props.onHandleAbout({showFooter: false, title: "Über", showBackButton: true});
      },

      render: function() {
        return (
          <section className="fit scroll center nice-padding">
            <div className="nice-padding"><img src="../dist/images/prayerz128.png" /></div>
            &copy; 2015 by <a href='http://zefanjas.de' target='_blank'>zefanjas.de</a>
            <p><a href='https://github.com/zefanja/prayerz' target='_blank'>Source code on GitHub</a></p>
          </section>
        );
      }
    });

module.exports = About;
