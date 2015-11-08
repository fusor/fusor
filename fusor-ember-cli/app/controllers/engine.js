import Ember from 'ember';

export default Ember.Controller.extend({

  rhevController: Ember.inject.controller('rhev'),

  engineTabName: Ember.computed.alias("rhevController.engineTabName"),
  engineTabNameLowercase: function () {
    return this.get('engineTabName').toLowerCase();
  }.property('engineTabName')
});
