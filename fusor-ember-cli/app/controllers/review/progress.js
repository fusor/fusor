import Ember from 'ember';

export default Ember.Controller.extend({

  isRhevOpen: false,
  isOpenStackOpen: false,
  isCloudFormsOpen: false,

  installationInProgress: true,

  prog: 1,

  incrementBy: 20,

});
