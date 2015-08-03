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
        name: "1 - Group 1",
        groupID: 1
      }, 
      {
        id: 2,
        sort: 1,
        name: "2 - Group 1",
        groupID: 1
      },
      {
        id: 3,
        sort: 2,
        name: "3 - Group 1",
        groupID: 1
      },
      {
        id: 4,
        sort: 3,
        name: "4 - Group 1",
        groupID: 1
      },
      {
        id: 1,
        sort: 0,
        name: "1 - Group 2",
        groupID: 2
      }, 
      {
        id: 2,
        sort: 1,
        name: "2 - Group 2",
        groupID: 2
      },
      {
        id: 3,
        sort: 2,
        name: "3 - Group 2",
        groupID: 2
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

function onMove( item ) {

  var initialGroupID = parseInt(_dragState.initialGroupID, 10);
  var targetGroupID = parseInt(item.targetGroupID, 10);

  var source = _cards.filter( function( card ) {
    return card.sort === parseInt(item.source, 10) && card.groupID === initialGroupID;
  })[0];
  var target = _cards.filter( function( card ) {
    return card.sort === parseInt(item.target, 10) && card.groupID === targetGroupID;
  })[0];


 // moving item to another group
  if ( initialGroupID !== targetGroupID ) {
    console.log('merda 1', source);
    source.groupID = targetGroupID;
    console.log('merda 2', source);
  }

  console.log('--------source:',source, target)

  var targetSort = target.sort;

  //CAREFUL, For maximum performance we must maintain the array's order, but change sort
  _cards.forEach(function( item ) {

    if ( item.groupID !== targetGroupID ) {
      return;
    }

    //Decrement sorts between positions when target is greater
    if ( target.sort > source.sort && (item.sort <= target.sort && item.sort > source.sort)){
      item.sort --;
    //Incremenet sorts between positions when source is greater
    } else if ( item.sort >= target.sort && item.sort < source.sort ) {
      item.sort ++;
    }
  });

  source.sort = targetSort;
}

var itemsByGroupID = function( groupID ) {
  var elemtns =  _cards.filter(function( card ) {
    return card.groupID === groupID;
  });

  // console.log('elemtns', elemtns);
  return elemtns;
};


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

  getItemsByGroupID: function( groupID ) {
    return itemsByGroupID( groupID );
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