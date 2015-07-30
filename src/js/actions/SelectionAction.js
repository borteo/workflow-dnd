var SelectionConstants  = require('../constants/SelectionConstants.js');
var SelectionDispatcher = require('../dispatchers/SelectionDispatcher.js');

var SelectionActions = {

  dragMoveItem: function( item ) {
    SelectionDispatcher.handleViewAction({
      actionType: SelectionConstants.DRAG_MOVE_ITEM,
      item: item
    });
  }

};

module.exports = SelectionActions;