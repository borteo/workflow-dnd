var React = require('react');
var Card = require('./Card.jsx');
var CardStore = require('../stores/CardStore.js');

function getCardState() {

  var itemsByID = CardStore.getItemsByGroupID( this.props.groupID );
  var totalHeight = getTotalHeight( itemsByID );

  return {
    items: itemsByID,
    style: {
      height: totalHeight + 'px'
    }
  };
}

function getTotalHeight( cards ){
  // get these values from props / store / somewhere?
  var rowHeight = 125;
  var verticalMargin = 20;

  return (Math.ceil(cards.length) * (rowHeight + verticalMargin) - verticalMargin);
}

var Cards = React.createClass({
  getInitialState: function() {
    return getCardState.call(this);
  },

  componentDidMount: function() {
    CardStore.addChangeListener( this._onChange );
  },

  componentWillUnmount: function() {
    CardStore.removeChangeListener( this._onChange );
  },

  render: function() { 

    return (
      <div 
        className="card-wrapper" 
        style={this.state.style}
      > {
        this.state.items.map(function( item, i ) {
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