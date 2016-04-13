import Ember from 'ember';

export default Ember.Route.extend({

  deactivate() {
    let controller = this.get('controller');
    let changedParams = [
      {
        name: 'Controller-1::NeutronPublicInterface',
        value: this.get('controller.externalNetworkInterface')
      },
      {
        name: 'Controller-1::AdminPassword',
        value: this.get('controller.overcloudPassword')
      },
      {
        name: 'Controller-1::AdminPassword',
        value: this.get('controller.overcloudPassword')
      },
      {
        name: 'Compute-1::NovaComputeLibvirtType',
        value: this.get('controller.openstackOvercloudLibvirtType')
      }
    ];

    this.send('updateOpenStackPlan', changedParams);
    return this.send('saveDeployment', null);
  }
});
