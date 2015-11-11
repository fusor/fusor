import Ember from 'ember';

export default Ember.Component.extend({

  click() {
    return this.set('errorMsg', null);
  }

});
