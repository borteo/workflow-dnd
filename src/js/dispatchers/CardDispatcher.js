var Dispatcher     = require('flux').Dispatcher;
var assign         = require('object-assign');
var CardConstants = require('../constants/CardConstants.js');

var CardDispatcher = assign(new Dispatcher(), {

  handleViewAction: function( action ) {
    this.dispatch({
      source: 'VIEW_ACTION',
      action: action
    });
  }

});

module.exports = CardDispatcher;
