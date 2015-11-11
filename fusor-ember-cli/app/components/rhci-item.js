import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['rhci-item'],
  classNameBindings: ['isChecked:rhci-item-selected'],

  click() {
    if (!this.get('isDisabled')) {
      this.set('isChecked', this.toggleProperty('isChecked'));
    }
  },

  showMsgToSelect: Ember.computed('isHover', 'isChecked', function() {
    return ( (this.get('isHover')) && (!(this.get('isChecked'))) );
  }),

  showMsgToDeselect: Ember.computed('isHover', 'isChecked', function() {
    return ( (this.get('isHover')) && (this.get('isChecked')) );
  }),

  mouseEnter() {
    this.set('isHover', true);
  },

  mouseLeave() {
    this.set('isHover', false);
  }

});
