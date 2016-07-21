import Ember from 'ember';

export default Ember.Mixin.create({

  setupController(controller, model) {
    controller.set('model', model);
    if (this.modelFor('deployment').get('isNotStarted')) {
      this.loadDiscoveredHosts();
    }
  },

  actions: {
    refreshDiscoveredHosts() {
      console.log('refresh allDiscoveredHosts');
      this.loadDiscoveredHosts();
    }
  },

  loadDiscoveredHosts() {
    var controller = this.get('controller');
    controller.set('isLoadingHosts', true);
    return Ember.RSVP.hash({
      deployingHosts: this.getDeployingHosts(),
      discoveredHosts: this.store.query('discovered-host', {per_page: 1000})
    }).then(hash => {
      this.set('controller.deployingHosts', hash.deployingHosts);
      this.set('controller.allDiscoveredHosts', hash.discoveredHosts.filterBy('is_discovered', true));
    }).finally(() => controller.set('isLoadingHosts', false));
  },

  getDeployingHosts() {
    let currentDeployment = this.modelFor('deployment');
    let discoveredHostRequests = [];

    return this.getRunningDeployments().then(deployments => {
      deployments.forEach(deployment => {
        if (deployment.get('id') !== currentDeployment.get('id')) {
          discoveredHostRequests.push(deployment.get('discovered_host'));
          discoveredHostRequests.push(deployment.get('discovered_hosts'));
        }
      });

      return Ember.RSVP.all(discoveredHostRequests);
    }).then(results => {
      let flattenedHosts = [];
      results.forEach(result => {
        if (Ember.isArray(result)) {
          result.forEach(host => flattenedHosts.push(host));
        } else {
          flattenedHosts.push(result);
        }
      });
      return flattenedHosts.uniq();
    });
  },

  getRunningDeployments() {
    let deployments = this.modelFor('application');
    return this.getDeploymentTasks(deployments).then(tasks => {
      let runningDeploymentTasks = tasks.filterBy('state', 'running');
      return deployments.filter(deployment => {
        return runningDeploymentTasks.any(task => task.get('id') === deployment.get('foreman_task_uuid'));
      });
    });
  },

  getDeploymentTasks(deployments) {
    let deploymentTaskRequests = deployments.mapBy('foreman_task_uuid').compact()
      .map(foremanTaskUuid => this.get('store').findRecord('foreman-task', foremanTaskUuid));
    return Ember.RSVP.all(deploymentTaskRequests);
  }

});
