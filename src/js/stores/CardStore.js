var _              = require('underscore');
var CardDispatcher = require('../dispatchers/CardDispatcher.js');
var CardConstants  = require('../constants/CardConstants.js');
var assign         = require('object-assign');
var EventEmitter   = require('events').EventEmitter;


var CHANGE_EVENT = 'change';

// cards model
var _cards = [
      {
        id: 1,
        sort: 0,
        name: "Ugly First card"
      }, 
      {
        id: 2,
        sort: 1,
        name: "Horrible Second card"
      },
      {
        id: 3,
        sort: 2,
        name: "Repugnant Third card"
      }
    ];

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

function onMove( items ) {

  var source = _.find(_cards, {sort: parseInt(items.source, 10)});
  var target = _.find(_cards, {sort: parseInt(items.target, 10)});

  var targetSort = target.sort;

  //CAREFUL, For maximum performance we must maintain the array's order, but change sort
  _cards.forEach(function(item){
    //Decrement sorts between positions when target is greater
    if(target.sort > source.sort && (item.sort <= target.sort && item.sort > source.sort)){
      item.sort --;
    //Incremenet sorts between positions when source is greator
    }else if(item.sort >= target.sort && item.sort < source.sort){
      item.sort ++;
    }
  });

  source.sort = targetSort;
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
    // order by sort
    return _cards.slice(0).sort(function( a, b ) {
      return a.sort - b.sort;
    });
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

      case CardConstants.ON_MOVE :
        onMove( action.item );
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