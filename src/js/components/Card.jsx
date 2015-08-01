var React = require('react');
var DragMixin = require('../mixins/DragMixin.jsx');
var CardStore = require('../stores/CardStore.js');


var Card = React.createClass({
  
  mixins: [DragMixin],

  getInitialState: function() {
    return {
      style : this.getStyle()
    };
  },

  componentWillMount: function() {
    CardStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    CardStore.removeChangeListener( this._onChange );
  },

  _onChange: function() {
    //console.info('_onChange Card');
    this.setState({
      style: this.getStyle()
    });
  },

  render: function() {
    var card = this.props.item;

    return (
      <div 
        className="card"
        data-key={card.sort}
        data-group={card.groupID}
        style={this.state.style}
      >
        <p>{card.name}</p>
      </div>
    )
  }

});


module.exports = Card;