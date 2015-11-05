import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['rhev'],
  engineTabName: Ember.computed.alias("controllers.rhev.engineTabName"),
  engineTabNameLowercase: function () {
    return this.get('engineTabName').toLowerCase();
  }.property('engineTabName')
});
