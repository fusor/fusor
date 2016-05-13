import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement() {
    return Ember.$('[data-toggle=popover]').popover();
  },

  willDestroyElement() {
    return Ember.$('[data-toggle=popover]').popover('destroy');
  }

});
