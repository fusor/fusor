import Ember from 'ember';

export default Ember.ObjectController.extend({

  username: '',
  password: '',
  disableCredentialsNext: function() {
    return ((this.get('username.length') === 0) || (this.get('password.length') === 0) );
  }.property('username', 'password')

});
