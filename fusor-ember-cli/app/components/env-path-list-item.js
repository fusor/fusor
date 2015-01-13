import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  classNames: ['path-list-item', 'list_item_active'],

  isChecked: function () {
    var env = this.get('env');
    var env_name = env.get('name');
    return (this.get('selectedEnvironment') === env_name);
  }.property('selectedEnvironment', 'env'),

  bgColor: function () {
    if (this.get('isChecked')) {
      return 'env_path_active';
    } else {
      return null;
    }
  }.property('isChecked'),

  click: function(event) {
    //this.set('color', 'blue');
    var env = this.get('env');
    var env_name = env.get('name');
    this.set('selectedEnvironment', env_name);
  },


});
