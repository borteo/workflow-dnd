var Dispatcher     = require('flux').Dispatcher;
var assign         = require('object-assign');
var SelectionConstants = require('../constants/SelectionConstants.js');

var SelectionDispatcher = assign(new Dispatcher(), {

  handleViewAction: function( action ) {
    this.dispatch({
      source: 'VIEW_ACTION',
      action: action
    });
  }

});

module.exports = SelectionDispatcher;
