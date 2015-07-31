var React           = require('react');
var _               = require('underscore');
var SelectionStore  = require('../stores/SelectionStore');
var SelectionAction = require('../actions/SelectionAction');

var CardStore  = require('../stores/CardStore');
var CardAction = require('../actions/CardAction');


var _dragTimeout = null;
var _itemParams = {
  itemWidth: 320,
  itemHeight: 220,
  horizontalMargin: 0,
  verticalMargin: 20,
  columns: 1,
  animation: false,
  isFiltered: false
};


var SelectionMixin = {

  getInitialState: function() {
    _itemParams = _.assign( _itemParams, this.props );
  },

  componentDidMount: function() {
    if ( !this.props.dragEnabled ) {
      return;
    }
    React.findDOMNode(this).addEventListener('mousedown', this.dragStart);
  },

  componentWillUnmount: function(){
    this.dragEnd();
  },

  getRow: function(index){
    return Math.floor(index / _itemParams.columns);
  },

  getPosition:function( index ){
    var row = this.getRow(index);
    var margin = _itemParams.horizontalMargin;
    var width = _itemParams.itemWidth;

    return {
      y: Math.round((_itemParams.itemHeight + _itemParams.verticalMargin) * row)
    };
  },

  getTransform: function( index ){
    var position = this.getPosition(index);
    return 'translate3d( 0, ' + position.y + 'px, 0)';
  },


  // get cards' position
  getStyle: function() {
    var item       = this.props.item;
    var dragItem   = CardStore.getDragState();
    var transform  = null;

    // if the element passed is on drag mode
    if ( dragItem && dragItem === item ) {
      return;
    }

    transform = this.getTransform( this.props.item.sort );
    var style = {
      width: _itemParams.itemWidth + 'px',
      height: _itemParams.itemHeight + 'px',
      WebkitTransform: transform,
      MozTransform: transform,
      msTransform: transform,
      transform: transform,
      position: 'absolute',
      boxSizing: 'border-box',
      display: _itemParams.isFiltered ? 'none' : 'block'
    };

    if ( _itemParams.animation ) {
      style.WebkitTransition = '-webkit-' + _itemParams.animation;
      style.MozTransition = '-moz-' + _itemParams.animation;
      style.msTransition = 'ms-' + _itemParams.animation;
      style.transition = _itemParams.animations;
    }

    return style;
  },

  dragStart: function( e ) {
    console.info('drag start');

    // left click
    if ( e.button !== 0 ) {
      return;
    }

    document.addEventListener('mousemove', this.dragMove, false);
    document.addEventListener('mouseup', this.dragEnd, false);

    e.preventDefault();

    var node = React.findDOMNode(this);
    var rect = node.getBoundingClientRect();

    CardAction.setDragState({
      item: this.props.item,
      initialMouseX: e.clientX,
      initialMouseY: e.clientY,
      initialX: Math.floor(rect.left),
      initialY: Math.floor(rect.top)
    });
    
  },

  dragMove: function( e ) {
    console.info('drag move');
    var tolerance = 3;

    var node = React.findDOMNode(this);
    var dragState = CardStore.getDragState();

    if (
      Math.abs( e.clientX - dragState.initialMouseX ) <= tolerance &&
      Math.abs( e.clientY - dragState.initialMouseY ) <= tolerance
    ) {
      return;
    }

    var clientX = e.clientX;
    var clientY = e.clientY;

    var targetKey;
    var targetElement = document.elementFromPoint(clientX, clientY);

    while ( targetElement.parentNode ) {
      if ( targetElement.getAttribute('data-key' )) {
        targetKey = targetElement.getAttribute('data-key');
        break;
      }
      targetElement = targetElement.parentNode;
    }

    // sort can be a configurable attribute dragState.item[conf]
    if ( targetKey && targetKey !== dragState.item.sort ) {
      
      CardAction.onMove({
        source: dragState.item.sort,
        target: targetKey
      });
    }

    var x = e.clientX - ( dragState.initialMouseX - dragState.initialX );
    var y = e.clientY - ( dragState.initialMouseY - dragState.initialY );

    // CardAction.setDragState({
    //   //, initialGroupID: this.props.groupID  // we can use it to compare swimlanes
    // });

    // transform inline -- is it a good idea?
    var transform = 'translate3d(' + x + 'px, ' + y + 'px, 0)';
    node.style.left = 0;
    node.style.top = 0;
    node.style.zIndex = 1000;
    node.style.position = 'fixed';

    node.style.webkitTransform = transform;
    node.style.msTransform = transform;
    node.style.transform = transform;
    node.style.webkitTransition = 'none';
    node.style.mozTransition = 'none';
    node.style.msTransition = 'none';
    node.style.transition = 'none';

    node.style.pointerEvents = 'none';

    if( !_dragTimeout ) {
      clearTimeout( _dragTimeout );
      _dragTimeout = null;
    }

    _dragTimeout = setTimeout(function dragTO() {
      SelectionAction.dragMoveItem();
    }, 15);

    e.stopPropagation();
    e.preventDefault();
  },
  
  dragEnd: function( e ) {
    console.info('endDrag');

    var tolerance = 3;

    if( !_dragTimeout ) {
      clearTimeout( _dragTimeout );
      _dragTimeout = null;
    }

    var dragState = CardStore.getDragState();

    CardAction.setDragState({
      item: this.props.item
      //, initialGroupID: this.props.groupID  // we can use it to compare swimlanes
    });


    var node = React.findDOMNode(this);

    var transform = this.getTransform( this.props.item.sort );

    node.style.position = "absolute";
    node.style.webkitTransform = transform;
    node.style.msTransform = transform;
    node.style.transform = transform;

    node.style.pointerEvents = 'auto';

    CardAction.setDragState({
      initialMouseX: 0,
      initialMouseY: 0,
      x: 0,
      y: 0,
      item: null
    });

    document.removeEventListener('mousemove', this.dragMove);
    document.removeEventListener('mouseup', this.dragEnd);
  }

};

module.exports = SelectionMixin;
