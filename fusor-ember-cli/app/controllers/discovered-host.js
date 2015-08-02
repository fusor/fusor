import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['deployment', 'hypervisor/discovered-host', 'engine/discovered-host'],

});
