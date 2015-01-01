'use strict';
var PageActions = require('../actions/PageActions');
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

      componentDidMount: function () {
        this.handleProps(this.props);
      },

      componentWillReceiveProps: function(nextProps) {
        this.handleProps(nextProps);
      },

      handleProps: function (inProps) {
        switch(inProps.page.id) {
          case "main":
            this.setState({title: "PrayerZ", back: false, add: true, cancel: false, done: false});
            break;
          case "add":
            this.setState({title: "Add Prayer", back: false, add: false, cancel: true, done: true});
        }
      },

      _handleAdd: function () {
        PageActions.setPage("add");
      },

      _handleCancel: function () {
        PageActions.setPage("main");
      },

      render: function() {
        //console.log(this.state, this.props);
        return (
            <section role="region">
              <header>
                <a href="#" className={(this.state.back) ? "" : "hide"}><span className="icon icon-back">back</span></a>
                <a href="#" className={(this.state.cancel) ? "" : "hide"} onClick={this._handleCancel}><span className="icon icon-close">close</span></a>
                <menu type="toolbar">
                  <button className={(this.state.add) ? "" : "hide"} onClick={this._handleAdd}><span className="icon icon-add">add</span></button>
                  <button className={(this.state.done) ? "" : "hide"}>done</button>
                </menu>
                <h1>{this.state.title}</h1>
              </header>
            </section>
        );
      }
    });

module.exports = Header;
