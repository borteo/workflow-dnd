var React = require('react');
var SelectionMixin = require('../mixins/SelectionMixin.jsx');
var SelectionStore = require('../stores/SelectionStore');


function styleItem() {
  return SelectionStore.getStyle( this.props.item );
}

var Card = React.createClass({
  
  mixins: [SelectionMixin],

  getInitialState: function() {
    return {
      style : this.getStyle( this.props.item )
    };
  },

  componentWillMount: function() {
    SelectionStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    SelectionStore.removeChangeListener( this._onChange );
  },

  _onChange: function() {
    console.log('_onChange Card');
    this.setState({
      style: this.getStyle()
    });
  },

  render: function() { 
    var card = this.props.item;

    return (
      <div 
        className="card"
        style={this.state.style}
      >
        <p>{card.name}</p>
      </div>
    )
  }

});


module.exports = Card;