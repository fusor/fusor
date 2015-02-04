import Ember from 'ember';

export default Ember.Component.extend({

  typeInput: function() {
    return (this.get('type') ? this.get('type') : 'text');
  }.property('type')

});
