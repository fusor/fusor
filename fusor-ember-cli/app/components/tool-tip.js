import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'span',

  attributeBindings: ['dataToggle:data-toggle', 'title'],
  dataToggle: 'tooltip',

  hasImage: Ember.computed.notEmpty('srcImage'),

  hasFaIcon: Ember.computed.notEmpty('faIcon'),

  didInsertElement() {
    return Ember.$('[data-toggle="tooltip"]').tooltip({placement: 'top'});
  },

  willDestroyElement() {
    return Ember.$('[data-toggle="tooltip"]').tooltip('destroy');
  }

});
