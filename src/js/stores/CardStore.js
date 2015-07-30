var _              = require('underscore');
var CardDispatcher = require('../dispatchers/CardDispatcher.js');
var CardConstants  = require('../constants/CardConstants.js');
var assign         = require('object-assign');
var EventEmitter   = require('events').EventEmitter;


var CHANGE_EVENT = 'change';

// cards model
var _cards     = [];

// dragging card state - does it make sense here?
var _dragState = {
  item: null,
  initialGroupID: 0,
  newGroupID: 0,
  initialMouseX: 0,
  initialMouseY: 0,
  x: 0,
  y: 0
};

function setStore( data ) {
  _cards = data; // TODO
}

function setDragState ( item ) {
  _dragState = _.assign( _dragState, item );
}


var CardStore = assign(EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function( callback ) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function() {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getStore: function() {
    // return _cards;
    return [
      {
        id: 1,
        name: "First card"
      }, 
      {
        id: 2,
        name: "Second card"
      },
      {
        id: 3,
        name: "Third card"
      }
    ];

  },

  getDragState: function() {
    return _dragState;
  },

  dispatcherIndex:CardDispatcher.register(function( payload ) {

    var action = payload.action;
    var change = true;

    switch( action.actionType ) {

      case CardConstants.SET_DRAG_STATE :
        setDragState( action.item );
      break;

      case CardConstants.ADD_CARD :
        break;

      default :
        change = false;
        break;

    }

    if ( change ) {
      CardStore.emitChange();
    }

    return true;

  })

});


module.exports = CardStore;