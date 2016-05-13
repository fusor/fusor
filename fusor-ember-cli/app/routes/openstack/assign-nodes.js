import Ember from 'ember';
import request from 'ic-ajax';

export default Ember.Route.extend({
  setupController(controller, model) {
    controller.set('model', model);
    this.loadOpenStack();
  },

  deactivate() {
    this.updateOpenstackDeployment();
    this.updateOpenstackDeployment();
    this.updateDeploymentPlan(this.getEditedParams());
    this.send('saveOpenstackDeployment');
  },

  loadOpenStack() {
    let controller = this.get('controller');
    let deployment = this.get('controller.deployment');
    let deploymentId = this.get('controller.deploymentId');
    let openstackDeployment = this.get('controller.openstackDeployment');

    controller.set('showSpinner', true);
    controller.set('errorMsg', null);

    if (deployment.get('deploy_openstack') && !Ember.isBlank(openstackDeployment.get('undercloud_admin_password'))) {
      controller.set('isOspLoading', true);
      Ember.RSVP.hash({
        // plan: this.store.findRecord('deployment-plan', deployment.get('id'), {reload: true}),
        // findRecord on deployment-plan is caching and not reloading, so using queryRecord for now.
        plan: this.store.queryRecord('deployment-plan', {deployment_id: deploymentId}),
        images: this.store.query('image', {deployment_id: deploymentId}),
        nodes: this.store.query('node', {deployment_id: deploymentId}),
        profiles: this.store.query('flavor', {deployment_id: deploymentId})
      }).then(hash => {
        controller.set('plan', hash.plan);
        controller.set('images', hash.images);
        controller.set('nodes', hash.nodes);
        controller.set('profiles', hash.profiles);
        this.updateRoleAssignments();
        this.updateEditableParams();
        controller.set('showSpinner', false);
      }).catch(error => {
        controller.set('showSpinner', false);
        controller.set('errorMsg', 'Error retrieving OpenStack data: ' + this.formatError(error));
        console.log('Error retrieving OpenStack data: ', error);
      });
    }
  },

  updateRoleAssignments() {
    let roles = this.get('controller.roles');

    roles.forEach(role => {
      role.set('flavor', this.get(`controller.openstackDeployment.${role.get('flavorDeploymentAttributeName')}`) || 'baremetal');
      role.set('count', this.get(`controller.openstackDeployment.${role.get('countDeploymentAttributeName')}`) || 0);
    });
  },

  updateEditableParams() {
    let roles = this.get('controller.roles');
    let plan = this.get('controller.plan');
    let params = this.get('controller.plan.parameters');
    let globalParams = this.get('controller.globalPlanParameters');
    let uneditableParams = {};

    roles.forEach(role => {
      role.set('image', plan.getParamValue(role.get('imageParameterName')));
      uneditableParams[role.get('countParameterName')] = true;
      uneditableParams[role.get('flavorParameterName')] = true;
      uneditableParams[role.get('imageParameterName')] = true;
    });

    for (let paramKey in params) {
      if (params.hasOwnProperty(paramKey)) {
        let param = params[paramKey];

        if (uneditableParams[paramKey] || param['Type'] === 'Json') {
          continue;
        }

        let paramObject = Ember.Object.create({
          key: paramKey,
          label: param['Label'],
          isBoolean: param['Type'] === 'Boolean',
          default: param['Default'],
          value: param['Default'],
          type: param['Type'] === 'Number' ? 'number' : 'text'
        });

        let role = this.findRoleForParamKey(paramKey);

        if (role) {
          role.get('parameters').push(paramObject);
        } else {
          globalParams.push(paramObject);
        }
      }
    }
  },

  findRoleForParamKey(paramKey) {
    let roles = this.get('controller.roles');
    return this.get('controller.roles').find(role => {
      return role.get('parameterPrefixes').find(prefix => {
        return paramKey.substring(0, prefix.length) === prefix;
      });
    });
  },

  updateOpenstackDeployment() {
    let roles = this.get('controller.roles');
    let profiles = this.get('controller.profiles');
    let hasValidNodeAssignments = this.get('controller.hasValidNodeAssignments');
    let computeFlavor = roles.findBy('name', 'Compute').get('flavor');

    roles.forEach(role => {
      if (!role.isAssigned()) {
        role.set('count', 0);
        if (hasValidNodeAssignments){
          role.set('flavor', computeFlavor);
        }
      }
      this.set(`controller.openstackDeployment.${role.get('flavorDeploymentAttributeName')}`, role.get('flavor'));
      this.set(`controller.openstackDeployment.${role.get('countDeploymentAttributeName')}`, role.get('count'));
    });
  },


  getEditedParams() {
    let editedParams = {};
    let globalPlanParameters = this.get('controller.globalPlanParameters');
    let roles = this.get('controller.roles');
    let plan = this.get('controller.plan');

    roles.forEach(role=> {
      let roleImage = role.get('image');
      let paramKey = role.get('imageParameterName');
      let paramImage = plan.getParamValue(paramKey);

      if (roleImage !== paramImage) {
        editedParams[paramKey] = roleImage;
      }
    });

    this.buildEditedParams(editedParams, globalPlanParameters);
    roles.forEach(role => this.buildEditedParams(editedParams, role.get('parameters')));

    return editedParams;
  },

  buildEditedParams(params, paramsArray) {
    paramsArray.forEach(gpp => {
      if (gpp.get('value') !== gpp.get('default')) {
        params[gpp.get('key')] = gpp.get('value');
      }
    });
  },

  updateDeploymentPlan(params) {
    if (!params || JSON.stringify(params) === JSON.stringify({})) {
      return;
    }

    let deploymentId = this.get('controller.deploymentId');
    request({
      url: `/fusor/api/openstack/deployments/${deploymentId}/deployment_plans/overcloud/update_parameters`,
      type: 'PUT',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-CSRF-Token": Ember.$('meta[name="csrf-token"]').attr('content')
      },
      data: JSON.stringify({'parameters': params})
    }).catch(
      function (error) {
        error = error.jqXHR;
        console.log('ERROR updating parameters');
        console.log(error);
      }
    );
  },

  formatError(error) {
    let errorMessage = '';
    if (Ember.typeOf(error) === 'error') {
      errorMessage = error.message + ': ';
      if (error.errors) {
        error.errors.forEach(subError => errorMessage += ' ' + subError);
      }
    }

    return errorMessage;
  }

});
