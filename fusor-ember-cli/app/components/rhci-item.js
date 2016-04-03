import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['row', 'rhci-item'],
  classNameBindings: ['isChecked:rhci-item-selected']
});
