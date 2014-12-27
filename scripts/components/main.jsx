'use strict';

var Header = require("./header.jsx");
var PrayerList = require("./prayerList.jsx");
var AddPrayer = require("./add.jsx");
var Footer = require("./footer.jsx");
var PageStore = require('../stores/PageStore');
var React = require('react'),

    Main = React.createClass({
      getInitialState: function () {
        return {
          prayers: [
            {title: "Franz", tags: "freunde", notes: "Probleme im Studium. Hilfe beim Lernen"},
            {title: "Klaus", tags: "freunde", notes: "Probleme im Studium. Hilfe beim Lernen"},
            {title: "Max", tags: "freunde", notes: "Probleme im Studium. Hilfe beim Lernen"},
            {title: "Erika", tags: "freunde", notes: "Probleme im Studium. Hilfe beim Lernen"},
            {title: "Haus", tags: "finanzen", notes: "Probleme im Studium. Hilfe beim Lernen"},
            {title: "Auto", tags: "finanzen", notes: "Probleme im Studium. Hilfe beim Lernen"},
            {title: "Luise", tags: "familie", notes: "Probleme im Studium. Hilfe beim Lernen"},
            {title: "Horst", tags: "familie", notes: "Probleme im Studium. Hilfe beim Lernen"}
          ],
          activePage: PageStore.getActive()
        };
      },

      componentDidMount: function() {
        PageStore.addChangeListener(this._onChange);
      },

      componentWillUnmount: function() {
        PageStore.removeChangeListener(this._onChange);
      },

      render: function() {
        var page;
        //console.log(this.state.activePage);
        switch(this.state.activePage.id) {
          case "main":
            page = <PrayerList data={this.state.prayers}/>
            break;
          case "add":
            page = <AddPrayer />
            break;
        }

        //<AddPrayer />

        return (
          <section className="vbox fit scroll">
            <Header page={this.state.activePage}/>
            {page}
            <Footer />
          </section>

        );
      },

      _onChange: function() {
        this.setState({activePage: PageStore.getActive()});
      }
    });

module.exports = Main;
