var React = require('react');
var Card = require('./Card.jsx');
var CardStore = require('../stores/CardStore.js');


function getCardState() {

  var allCards = CardStore.getStore();
  var totalHeight = getTotalHeight( allCards );

  return {
    allCards: allCards,
    style: {
      height: totalHeight + 'px'
    }
  };
}

function getTotalHeight( cards ){
  // get these values from props / store / somewhere?
  var rowHeight = 125;
  var verticalMargin = 20;

  return (Math.ceil(cards.length) * rowHeight);
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
    
    var items = this.props.items;

    return (
      <div 
        className="card-wrapper" 
        style={this.state.style}
      > {
        items.map(function( item, i ) {
          return (
            <Card 
              key={i}
              dragEnabled={true}
              item={item}
              itemWidth={350}
              itemHeight={125}
            />
          )
        })
      } </div>
    )
  },

  _onChange: function() {

    //console.info('_onChange Cards')
    //this.setState( getCardState() );
  }

});


module.exports = Cards;