import Ember from 'ember';

export default Ember.View.reopen({
  init() {
    this._super();
    var self = this;

    // bind attributes beginning with 'data-'
    Object.keys(this).forEach(function(key) {
      if (key.substr(0, 5) === 'data-') {
        self.get('attributeBindings').pushObject(key);
      }
    });
  }
});