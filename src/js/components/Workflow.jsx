var React = require('react');
var Cards = require('./Cards.jsx');
var CardStore = require('../stores/CardStore.js');


var Workflow = React.createClass({
  getInitialState: function() {
    return null;
  },

  render: function() { 
    var groupIDs = [
      {
        id: 1
      },
      {
        id: 2
      }
    ];

    return (
      <div>
        <h1>Drag &amp; Drop</h1>
        <div className="worflow">
          {
          groupIDs.map(function( groupID, i ) {
            return (
              <Cards 
                key={i}
                items={CardStore.getItemsByGroupID( groupID.id )}
              />
            )
          })
        } </div>
      </div>
    )
  }

});


module.exports = Workflow;