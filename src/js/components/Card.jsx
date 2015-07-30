var React = require('react');
var DragMixin = require('../mixins/DragMixin.jsx');
var SelectionStore = require('../stores/SelectionStore');


var Card = React.createClass({
  
  mixins: [DragMixin],

  getInitialState: function() {
    return {
      style : this.getStyle()
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