var React = require('react');
var Card = require('./Card.jsx');
var CardStore = require('../stores/CardStore.js');


function getCardState() {
  return {
    allCards: CardStore.getStore()
  };
}


var Cards = React.createClass({
  getInitialState: function() {
    return getCardState();
  },

  componentDidMount: function() {
    CardStore.addChangeListener( this._onChange );
  },

  componentWillUnmount: function() {
    CardStore.removeChangeListener( this._onChange );
  },

  render: function() { 
    
    var cards = this.state.allCards;

    return (
      <div className="card-wrapper"> {
        cards.map(function( card, i ) {
          return (
            <Card 
              key={i}
              dragEnabled={true}
              item={card}
              itemWidth={350}
              itemHeight={125}
            />
          )
        })
      } </div>
    )
  },

  _onChange: function() {

    console.info('_onChange Cards')
    //this.setState( getCardState() );
  }

});


module.exports = Cards;