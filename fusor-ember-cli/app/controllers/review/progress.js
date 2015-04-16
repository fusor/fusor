import Ember from 'ember';

export default Ember.Controller.extend({

  isRhevOpen: true,
  isOpenStackOpen: false,
  isCloudFormsOpen: false,
  foremanTasksURL: null,

  installationInProgress: true,

  prog: 1,

  incrementBy: 20,

});
