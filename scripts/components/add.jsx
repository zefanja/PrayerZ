'use strict';
var PageStore = require('../stores/PageStore');
var PrayerStore = require('../stores/PrayerStore');
var TagActions = require('../actions/TagActions');
var PrayerActions = require('../actions/PrayerActions');
var PageActions = require('../actions/PageActions');
var uiEvents = require('../components/uiEvents');

var React = require('react'),

    AddPrayer = React.createClass({
      getInitialState: function () {
        return {
          title: "",
          tags: "",
          text: ""
        };
      },

      componentDidMount: function() {
        uiEvents.addDoneListener(this._onDone);
      },

      componentWillUnmount: function() {
        uiEvents.removeDoneListener(this._onDone);
      },

      handleTitle: function (e) {
        this.setState({title: e.target.value});
      },

      handleTags: function (e) {
        this.setState({tags: e.target.value});
      },

      handleText: function (e) {
        this.setState({text: e.target.value});
      },

      handleClearTitle: function () {
        this.setState({title: ""});
      },

      handleClearTags: function () {
        this.setState({tags: ""});
      },

      _onDone: function (e) {
        PageActions.setPage("main");
        PrayerActions.create(this.state.title, this.state.text, this.state.tags);
        console.log(PrayerStore.getAll());
      },

      render: function() {
        return (
          <section role="region" className="fit scroll nice-padding">
            <form>
              <p>
                <input type="text" placeholder="Title" required="" value={this.state.title} onChange={this.handleTitle}/>
                <button type="reset" onClick={this.handleClearTitle}>Clear</button>
              </p>
              <p>
                <input type="text" placeholder="Tags" required="" value={this.state.tags} onChange={this.handleTags}/>
                <button type="reset" onClick={this.handleClearTags}>Clear</button>
              </p>
              <p>
                <textarea placeholder="Notes..." required="" value={this.state.text} onChange={this.handleText}></textarea>
              </p>
            </form>
          </section>
        );
      }
    });

module.exports = AddPrayer;
