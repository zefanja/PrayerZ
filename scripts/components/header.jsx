'use strict';
var React = require('react'),

    Header = React.createClass({
      getInitialState: function () {
        return {
          title: "",
          back: false,
          cancel: false,
          add: false,
          done: false
        };
      },

      componentDidMount: function(nextProps) {
        switch(this.props.page.id) {
          case "main":
            this.setState({title: "PrayerZ", back: false, add: true, cancel: false, done: false});
            break;
          case "add":
            this.setState({title: "Add Prayer", back: false, add: false, cancel: true, done: true});
        }
      },

      render: function() {
        //console.log(this.state, this.props);
        return (
            <section role="region">
              <header>
                <a href="#" className={(this.state.back) ? "" : "hide"}><span className="icon icon-back">back</span></a>
                <a href="#" className={(this.state.cancel) ? "" : "hide"}><span className="icon icon-close">close</span></a>
                <menu type="toolbar">
                  <button className={(this.state.add) ? "" : "hide"}><span className="icon icon-add">add</span></button>

                  <button className={(this.state.done) ? "" : "hide"}>done</button>
                </menu>
                <h1>{this.state.title}</h1>
              </header>
            </section>
        );
      }
    });

module.exports = Header;
