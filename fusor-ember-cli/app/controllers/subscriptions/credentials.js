import Ember from 'ember';

export default Ember.Controller.extend({

  buttonLoginTitle: 'Login',

  disableCredentialsNext: function() {
    return (Ember.isBlank(this.get('identification')) || Ember.isBlank(this.get('password')));
  }.property('username', 'password'),

});
