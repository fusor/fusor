import Ember from 'ember';

export default Ember.Component.extend({

  click: function() {
    return this.set('errorMsg', null);
  }

});
