import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['rhci-item'],
  classNameBindings: ['isChecked:rhci-item-selected'],

  click: function() {
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

  mouseEnter: function(){
    this.set('isHover', true);
  },

  mouseLeave: function(){
    this.set('isHover', false);
  }

});
