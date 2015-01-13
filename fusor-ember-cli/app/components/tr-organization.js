import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'tr',

  isChecked: function () {
    var org = this.get('org');
    var org_name = org.get('name');
    return (this.get('selectedOrganzation') == org_name);
  }.property('selectedOrganzation', 'org'),

  showCheckMark: function () {
    if (this.get('isChecked')) {
      return '✔';
    }
  }.property('isChecked'),

  classNameBindings: ['bgColor', 'fontColor'],
  bgColor: function () {
    if (this.get('isChecked')) {
      return 'blue';
    } else {
      return null;
    }
  }.property('isChecked'),

  fontColor: function () {
    if (this.get('isChecked')) {
      return 'fontwhite';
    } else {
      return null;
    }
  }.property('isChecked'),

  // highlight: function() {
  //   return this.get('color');
  // },

  // mouseEnter: function(event) {
  //   if (isChecked) {
  //     this.set('color', 'blue');
  //   } else {
  //     this.set('color', 'yellow');
  //   }
  // },

  // mouseLeave: function(event) {
  //   if (isChecked) {
  //     this.set('color', 'blue');
  //   } else {
  //     this.set('color', null);
  //   }
  // },
  click: function(event) {
    //this.set('color', 'blue');
    var org = this.get('org');
    var org_name = org.get('name');
    this.set('selectedOrganzation', org_name);
  },
});
