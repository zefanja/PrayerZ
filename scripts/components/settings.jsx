'use strict';
var TagStore = require('../stores/TagStore');
var PageStore = require('../stores/PageStore');
var PageActions = require('../actions/PageActions');
var uiEvents = require('../components/uiEvents');
var React = require('react'),

    Settings = React.createClass({
      getInitialState: function () {
        return {
          tags: TagStore.getAllTagText(),
          daysOfWeek: {},
          settings: PageStore.getSettings()
        };
      },

      componentDidMount: function() {
        uiEvents.addUpdateListener(this._onUpdate);
        var savedTags = this.state.settings.daysOfWeek;
        var daysOfWeek = {
          "monday" : TagStore.getTagText(savedTags.monday),
          "tuesday" : TagStore.getTagText(savedTags.tuesday),
          "wednesday" : TagStore.getTagText(savedTags.wednesday),
          "thursday" : TagStore.getTagText(savedTags.thursday),
          "friday" : TagStore.getTagText(savedTags.friday),
          "saturday" : TagStore.getTagText(savedTags.saturday),
          "sunday" : TagStore.getTagText(savedTags.sunday)
        };
        this.setState({daysOfWeek: daysOfWeek});
      },

      componentWillUnmount: function() {
        uiEvents.removeUpdateListener(this._onUpdate);
      },

      _handleInput: function (e) {
        var key = e.target.name;
        this.state.daysOfWeek[key] = e.target.value;
        this.forceUpdate();
      },

      _onUpdate: function (e) {
        var updates = {
          "monday" : TagStore.getTagIds(this.state.daysOfWeek.monday),
          "tuesday" : TagStore.getTagIds(this.state.daysOfWeek.tuesday),
          "wednesday" : TagStore.getTagIds(this.state.daysOfWeek.wednesday),
          "thursday" : TagStore.getTagIds(this.state.daysOfWeek.thursday),
          "friday" : TagStore.getTagIds(this.state.daysOfWeek.friday),
          "saturday" : TagStore.getTagIds(this.state.daysOfWeek.saturday),
          "sunday" : TagStore.getTagIds(this.state.daysOfWeek.sunday)
        };
        PageActions.updateSettings("daysOfWeek", updates);
      },

      render: function() {
        return (
          <section role="region" className="nice-padding fit scroll">
            <div className="small">If you like to pray for just some of your prayer requests on a specific day,
              please enter a tag!
            </div>
            <div className="nice-tb-padding">
              <form>
                <p>
                  <input type="text" placeholder="Monday" required="" name="monday" value={this.state.daysOfWeek.monday} onChange={this._handleInput}/>
                </p>
                <p>
                  <input type="text" placeholder="Tuesday" required="" name="tuesday" value={this.state.daysOfWeek.tuesday} onChange={this._handleInput}/>
                </p>
                <p>
                  <input type="text" placeholder="Wednesday" required="" name="wednesday" value={this.state.daysOfWeek.wednesday} onChange={this._handleInput}/>
                </p>
                <p>
                  <input type="text" placeholder="Thursday" required="" name="thursday" value={this.state.daysOfWeek.thursday} onChange={this._handleInput}/>
                </p>
                <p>
                  <input type="text" placeholder="Friday" required="" name="friday" value={this.state.daysOfWeek.friday} onChange={this._handleInput}/>
                </p>
                <p>
                  <input type="text" placeholder="Saturday" required="" name="saturday" value={this.state.daysOfWeek.saturday} onChange={this._handleInput}/>
                </p>
                <p>
                  <input type="text" placeholder="Sunday" required="" name="sunday" value={this.state.daysOfWeek.sunday} onChange={this._handleInput}/>
                </p>
              </form>
            </div>
            <div className="small">Available tags: {this.state.tags}</div>
          </section>
        );
      }
    });

module.exports = Settings;
