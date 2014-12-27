'use strict';

var React = require('react'),

    AddPrayer = React.createClass({
      render: function() {
        return (
          <section role="region" className="fit scroll nice-padding">
            <form>
              <p>
                <input type="text" placeholder="Title" required="" />
                <button type="reset">Clear</button>
              </p>
              <p>
                <input type="text" placeholder="Tags" required="" />
                <button type="reset">Clear</button>
              </p>
              <p>
                <textarea placeholder="Notes..." required=""></textarea>
              </p>
            </form>
          </section>
        );
      }
    });

module.exports = AddPrayer;
