var CardDispatcher = require('../dispatchers/CardDispatcher.js');
var CardConstants  = require('../constants/CardConstants.js');
var assign         = require('object-assign');
var EventEmitter   = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

var _cards = [];

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

  setStore: function( data ) {
    _cards = data; // TODO
  },

  getStore: function() {
    // return _cards;
    return [
      {
        id: 1,
        name: "First card",
        itemWidth: 290,
        itemHeight: 180
      }, 
      {
        id: 2,
        name: "Second card",
        itemWidth: 290,
        itemHeight: 180
      },
      {
        id: 3,
        name: "Third card",
        itemWidth: 290,
        itemHeight: 180
      }
    ];

  },

  dispatcherIndex:CardDispatcher.register(function( payload ) {

    var action = payload.action;
    var change = true;

    switch(action.actionType) {

      case CardConstants.ADD_CARD :
        console.log('add card');
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