import Ember from 'ember';

export default Ember.Component.extend({

  didInsertElement() {
    return Ember.$('[data-toggle="tooltip"]').tooltip({placement: 'right'});
  },

  willDestroyElement() {
    return Ember.$('[data-toggle="tooltip"]').tooltip('destroy');
  }

});
