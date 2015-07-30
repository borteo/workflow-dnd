var CardConstants  = require('../constants/CardConstants.js');
var CardDispatcher = require('../dispatchers/CardDispatcher.js');

var CardActions = {

  setDragState: function( item ) {
    CardDispatcher.handleViewAction({
      actionType: CardConstants.SET_DRAG_STATE,
      item: item
    });
  },
  
  addCard: function( item ) {
    CardDispatcher.handleViewAction({
      actionType: CardConstants.ADD_CARD,
      item: item
    });
  },
  
  removeCard: function( item ) {
    CardDispatcher.handleViewAction({
      actionType: CardConstants.REMOVE_CARD,
      item: item
    });
  }

};

module.exports = CardActions;