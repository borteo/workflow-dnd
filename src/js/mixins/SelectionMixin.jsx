var React = require('react');
var SelectionStore  = require("../stores/SelectionStore");
var SelectionAction = require("../actions/SelectionAction");


// function getStateFromStore( state ) {
//   state = state || {};

//   return {
//     cardStore: CardStore.getStore()
//   };
// }


var SelectionMixin = {
  
  dragTimeout: null,

  initialMouse: {
    X: null,
    Y: null
  },

  initialEvent: {
    X: null,
    Y: null
  },

  drag: {
    X: null,
    Y: null,
    item: null
  },

  itemWidth: 320,
  itemHeight: 220,
  horizontalMargin: 20,
  columns: 1,
  verticalMargin: 20,

  getRow: function(index){
    return Math.floor(index / this.columns);
  },

  getColumn: function(index){
    return index - (this.getRow(index) * this.columns);
  },

  getPosition:function( index ){
    var col = this.getColumn(index);
    var row = this.getRow(index);
    var margin = this.horizontalMargin;
    var width = this.itemWidth;

    return {
      x: Math.round((col * width) + (col * margin)),
      y: Math.round((this.itemHeight + this.verticalMargin) * row)
    };
  },

  getTransform: function( index ){
    var position = this.getPosition(index);
    return 'translate3d(' + position.x + 'px, ' + position.y + 'px, 0)';
  },


  getStyle: function( item ) {

    console.log('getStyle---', item)

    var animation = true;
    var isFiltered = false;
    var transform = null;

    // if the element passed is on drag mode
    if ( this.props.item ===  this.drag.item ) {
      var dragStyle = {};
      transform = 'translate3d(' + this.drag.X + 'px, ' + this.drag.Y + 'px, 0)';
      //Makes positioning simpler if we're fixed
      dragStyle.position = 'fixed';
      dragStyle.zIndex = 1000;
      //Required for Fixed positioning
      dragStyle.left = 0;
      dragStyle.top = 0;
      dragStyle.WebkitTransform = transform;
      dragStyle.MozTransform = transform;
      dragStyle.msTransform = transform;
      dragStyle.transform = transform;

      //Turn off animations for this item
      dragStyle.WebkitTransition = 'none';
      dragStyle.MozTransition = 'none';
      dragStyle.msTransition = 'none';
      dragStyle.transition = 'none';

      //Allows mouseover to work
      dragStyle.pointerEvents = 'none';

      return dragStyle;
    }

    transform = this.getTransform( item.id - 1 );
    var style = {
      width: this.itemWidth + 'px',
      height: this.itemHeight + 'px',
      WebkitTransform: transform,
      MozTransform: transform,
      msTransform: transform,
      transform: transform,
      position: 'absolute',
      boxSizing: 'border-box',
      display: isFiltered ? 'none' : 'block'
    };

    if( animation ){
      style.WebkitTransition = '-webkit-' + animation;
      style.MozTransition = '-moz-' + animation;
      style.msTransition = 'ms-' + animation;
      style.transition = animation;
    }

    return style;
  },

  dragMove: function( e ) {
    console.log('drag move')
    var tolerance = 3;
    var pageX = e.pageX;
    var pageY = e.pageY;

    var xMovement = Math.abs(this.initialEvent.X - pageX);
    var yMovement = Math.abs(this.initialEvent.Y - pageY);

    if ( xMovement > tolerance || yMovement > tolerance ) {
      var clientX = e.clientX;
      var clientY = e.clientY;

      this.drag.X = clientX - this.initialMouse.X;
      this.drag.Y = clientY - this.initialMouse.Y;

      var targetKey;
      var targetElement = document.elementFromPoint(clientX, clientY);
      // while(targetElement.parentNode){
      //   if(targetElement.getAttribute('data-key')){
      //     targetKey = targetElement.getAttribute('data-key');
      //     break;
      //   }
      //   targetElement = targetElement.parentNode;
      // }

      // if(targetKey && targetKey !== this.dragItem[this.keyProp]){
      //   this.moveFn(this.dragItem[this.keyProp], targetKey);
      // }

      if( !! this.dragTimeout ) {
        clearTimeout(this.dragTimeout);
        this.dragTimeout = null;
      }

      var that = this;
      this.dragTimeout = setTimeout(function() {
        SelectionAction.dragMoveItem( that.drag.item );
      }, 15);


      e.stopPropagation();
      e.preventDefault();
    }
  },

  endDrag: function( e ) {
    console.log('drag end')
    this.drag.item = null;

    if( !! this.dragTimeout ) {
      clearTimeout(this.dragTimeout);
      this.dragTimeout = null;
    }

    document.removeEventListener('mousemove', this.dragMove);
    document.removeEventListener('mouseup', this.endDrag);
  },

  startDrag: function( e, domNode, item ) {

    // left click
    if ( e.button !== 0 ) {
      return;
    }

    this.drag.item = item;
    var rect = domNode.getBoundingClientRect();
    var pageX = e.pageX;
    var pageY = e.pageY;


    this.initialMouse.X = Math.round(pageX - (rect.left + window.pageXOffset));
    this.initialMouse.Y = Math.round(pageY - (rect.top + window.pageYOffset));
    this.initialEvent.X = pageX;
    this.initialEvent.Y = pageY;


    document.addEventListener('mousemove', this.dragMove);
    document.addEventListener('mouseup', this.endDrag);

    //This is needed to stop text selection in most browsers
    e.preventDefault();
  },

  onDrag: function( e ) {
    console.log('dragging------------');
    var domNode = React.findDOMNode(this);

    this.startDrag( e, domNode, this.props.item );
  },

  componentDidMount: function() {
    if ( !this.props.dragEnabled ) {
      return;
    }

    React.findDOMNode(this).addEventListener('mousedown', this.onDrag);
  },

  componentWillUnmount: function(){
    this.endDrag();
  }

};

module.exports = SelectionMixin;
