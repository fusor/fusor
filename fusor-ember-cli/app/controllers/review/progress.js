import Ember from 'ember';

export default Ember.Controller.extend({

  isRhevOpen: true,
  isOpenStackOpen: false,
  isCloudFormsOpen: false,

  installationInProgress: true,

  prog: 1,

  incrementBy: 20,

});
