import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['rhci-item'],
  classNameBindings: ['isChecked:rhci-item-selected:rhci-item-deselected', 'isHover:rhci-item-hover'],

  click: function() {
    this.set('isChecked', this.toggleProperty('isChecked'));
    // if (this.get('isChecked')) {
    //   this.set('isHover', false);
    // }
  },

  isHover: false,

  showMsgToSelect: function() {
    return ( (this.get('isHover')) && (!(this.get('isChecked'))) );
  }.property('isHover', 'isChecked'),

  showMsgToDeselect: function() {
    return ( (this.get('isHover')) && (this.get('isChecked')) );
  }.property('isHover', 'isChecked'),

  mouseEnter: function(){
    this.set('isHover', true);
  },

  mouseLeave: function(){
    this.set('isHover', false);
  },

  // didInsertElement: function(){
  //     this.$().hide().show('fast');
  // }

  // actions: {
  //   toggleHover: function() {
  //     this.set('isHover', this.toggleProperty('isHover'));
  //   }
  // }

});
