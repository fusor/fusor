import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'div',
  classNames: ['row', 'ose-node-line'],

  cssId: Ember.computed('typeNode', 'label', function() {
    return `${this.get('typeNode')}-${this.get('label').underscore()}`;
  })

});
