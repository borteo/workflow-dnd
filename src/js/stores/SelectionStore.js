var SelectionDispatcher = require('../dispatchers/SelectionDispatcher.js');
var SelectionConstants  = require('../constants/SelectionConstants.js');
var assign         = require('object-assign');
var EventEmitter   = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

var _selection = [];

var SelectionStore = assign(EventEmitter.prototype, {

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
    return _selection;
  },

  getStyle: function() {
    return _selection;
  },

  dispatcherIndex:SelectionDispatcher.register(function( payload ) {

    var action = payload.action;
    var change = true;

    switch(action.actionType) {

      case SelectionConstants.DRAG_MOVE_ITEM:
        console.log('dragMoveItem Selection Store');
        break;

      default :
        change = false;
        break;

    }

    if ( change ) {
      SelectionStore.emitChange();
    }

    return true;

  })

});


module.exports = SelectionStore;