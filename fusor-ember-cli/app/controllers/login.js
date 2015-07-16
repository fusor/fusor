import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['application'],

  identification: null,
  password: null,
  errorMessage: null,

});
