import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    var deployment = this.modelFor('deployment');
    var deployTaskPromise = this.store.findRecord('foreman-task', deployment.get('foreman_task_uuid'));
    var subtasksOfDeployPromise = this.store.query('foreman-task', {search: "parent_task_id = " + deployment.get('foreman_task_uuid')});
    var self = this;
    return Ember.RSVP.Promise.all([
      deployTaskPromise,
      subtasksOfDeployPromise
    ]).then(function(results) {
      var deployTask = results[0];
      var subtasksOfDeploy = results[1];
      var manageContentTask = subtasksOfDeploy.findBy('humanized_name', 'Manage Content');
      var rhevTask          = subtasksOfDeploy.findBy('humanized_name', 'Deploy Red Hat Enterprise Virtualization');
      var openstackTask     = subtasksOfDeploy.findBy('humanized_name', 'Deploy Red Hat OpenStack Platform overcloud');
      var cfmeTask          = subtasksOfDeploy.findBy('humanized_name', 'Deploy CloudForms Management Engine');
      var openshiftTask     = subtasksOfDeploy.findBy('humanized_name', 'Deploy OpenShift Enterprise');

      return Ember.RSVP.hash({
        deployTask: deployTask,
        manageContentTask: manageContentTask,
        rhevTask: rhevTask,
        openstackTask: openstackTask,
        cfmeTask: cfmeTask,
        openshiftTask: openshiftTask,
        deployment: deployment
      });
    });
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('deployTask', model.deployTask);
    controller.set('manageContentTask', model.manageContentTask);
    controller.set('rhevTask', model.rhevTask);
    controller.set('openstackTask', model.openstackTask);
    controller.set('cfmeTask', model.cfmeTask);
    controller.set('openshiftTask', model.openshiftTask);
    controller.set('deployment', model.deployment);
    controller.set('katelloSyncErrorTasks', null);
    controller.stopPolling();

    ////////////////////////////////////////////////////////////
    // NOTE: If an error during a pulp sync occurs, the Katello::Sync
    // task scheduled in the Fusor Deploy task tree will throw itself
    // into a skipped/warning state. This ultimately bubbles, sending
    // Fusor::Actions::ManageContent into a paused/error state due to
    // sub-task error.
    //
    // We can push the Deployment task into a clean state by triggering
    // resume on ManageContent. This releases any locks held by the failed
    // task and allows for redeployment, abondonment, or manual content sync.
    //
    // TODO: It's safer for ManageContent to be monitored and resumed
    // serverside once a given deployment has been initiated.
    ////////////////////////////////////////////////////////////
    let contentErrorDiscovered =
      model.manageContentTask.get('result') === 'error' &&
      model.manageContentTask.get('state') === 'paused';
    ////////////////////////////////////////////////////////////

    if(contentErrorDiscovered) {
      model.deployment.set('has_content_error', true);

      model.deployment.save()
      .then(() => model.manageContentTask.resume())
      .then((resumeResult) => this.refresh())
      .catch((reason) => {
        console.log(
          'ERROR: Something broke trying to recover the ManageContentTask');
      });

    } else if(!model.deployment.get('has_content_error')) {
      controller.startPolling();
    } else {
      // has_content_error == true and no contentErrorDiscovered, it's been reset
      model.manageContentTask.get('subtasks').then(tasks => {
        controller.set('katelloSyncErrorTasks', tasks.filter(task => {
          return task.get('humanized_name') === 'Synchronize' &&
                 task.get('state') === 'stopped' &&
                 task.get('result') === 'warning';
        }));
      });
    }
  },

  activate() {
    window.scrollTo(0,0);
  },

  deactivate() {
    this.get('controller').stopPolling();
  },

  actions: {
    refreshModelOnOverviewRoute() {
      return this.refresh();
    }
  }

});
