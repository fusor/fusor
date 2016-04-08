import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    var deployment_id = this.modelFor('deployment').get('id');
    return Ember.RSVP.hash({
      deployment: this.store.findRecord('deployment', deployment_id),
      fusorDomainName: this.store.findAll('hostgroup').then(function(hostgroups) {
        return hostgroups.filterBy('name', 'Fusor Base').get('firstObject')
          .get('domain.name');
      })
    });
  },
  setupController(controller, model) {
    controller.set('model', model.deployment);
    controller.set('fusorDomainName', model.fusorDomainName);
  }

});
