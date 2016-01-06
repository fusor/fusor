import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'p',

  classNames: ['log-entry'],
  classNameBindings: ['levelClass'],

  levelClass: Ember.computed('entry.level', function() {
    var level = this.get('entry.level');

    if (!level) {
      return null;
    }

    return `log-entry-level-${level.toLowerCase()}`;
  })
});
