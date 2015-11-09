import Ember from 'ember';
import NeedsDeploymentMixin from "./needs-deployment-mixin";

export default Ember.Mixin.create(NeedsDeploymentMixin, {

  selectedOrganization: Ember.computed.alias("model"),

  fields_org: {},

  showAlertMessage: false,

  // default Organization name for New Organizations
  defaultOrgName: Ember.computed(function () {
    return this.getWithDefault('defaultOrg', this.get('deploymentName'));
  }),

  orgLabelName: Ember.computed('defaultOrgName', function() {
    if(this.get('fields_org.name')) {
      return this.get('defaultOrgName').underscore();
    }
  }),

  actions: {
    createOrganization: function() {
        var self = this;
        this.set('fields_org.name', this.get('defaultOrgName'));
        var organization = this.store.createRecord('organization', this.get('fields_org'));
        self.set('fields_org',{});
        self.set('defaultOrgName', null);
        self.set('selectedOrganization', organization);
        organization.save().then(function(org) {
          //success
          self.set('organization', org);
          return self.set('showAlertMessage', true);
        }, function(error) {
          self.get('deploymentController').set('errorMsg', 'error saving organization' + error);
        });
    }
  }

});
