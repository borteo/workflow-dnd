var React = require('react');
var Cards = require('./Cards.jsx');
var CardStore = require('../stores/CardStore.js');


// function getItems() {
//   return 
// }

var Workflow = React.createClass({
  getInitialState: function() {
    return null;
  },

  // componentWillMount: function() {
  //   CardStore.addChangeListener(this._onChange);
  // },

  // componentWillUnmount: function() {
  //   CardStore.removeChangeListener( this._onChange );
  // },

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
                groupID={groupID.id}
              />
            )
          })
        } </div>
      </div>
    )
  }

  // _onChange: function() {

  //   console.info('_onChange Workflow')
  //   //this.setState( getCardState() );
  // }

});


module.exports = Workflow;