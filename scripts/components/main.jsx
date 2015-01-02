'use strict';

var Header = require("./header.jsx");
var PrayerList = require("./prayerList.jsx");
var AddPrayer = require("./add.jsx");
var Footer = require("./footer.jsx");
var PageStore = require('../stores/PageStore');
var PrayerStore = require('../stores/PrayerStore');
var PageActions = require('../actions/PageActions');
var React = require('react'),

    Main = React.createClass({
      getInitialState: function () {
        return {
          prayers: PrayerStore.getAll(),
          activePage: PageStore.getActive(),
          editMode: false
        };
      },

      componentDidMount: function() {
        PageStore.addChangeListener(this._onChange);
      },

      componentWillUnmount: function() {
        PageStore.removeChangeListener(this._onChange);
      },

      handleEditMode: function () {
        this.setState({editMode: true});
        PageActions.setPage("edit");
      },

      render: function() {
        var page;
        switch(this.state.activePage.id) {
          case "main":
          case "edit":
            page = <PrayerList editMode={this.state.editMode} data={this.state.prayers}/>
            break;
          case "add":
            page = <AddPrayer />
            break;
        }

        return (
          <section className="vbox fit scroll">
            <Header page={this.state.activePage}/>
            {page}
            <Footer onEditMode={this.handleEditMode} editMode={this.state.editMode}/>
          </section>

        );
      },

      _onChange: function() {
        var active = PageStore.getActive();
        if(active.id === "main") {
          this.setState({editMode: false, activePage: active});
        } else {
          this.setState({activePage: active});
        }
      }
    });

module.exports = Main;
