import Ember from 'ember';

export default Ember.Route.extend({

  deactivate() {
    var controller = this.get('controller'),
      changedParams = [
        {
          name: 'Controller-1::NeutronPublicInterface',
          value: this.get('controller.externalNetworkInterface')
        },
        {
          name: 'Controller-1::AdminPassword',
          value: this.get('controller.overcloudPassword')
        }
      ];

    this.send('updateOpenStackPlan', changedParams);
    return this.send('saveDeployment', null);
  }
});
