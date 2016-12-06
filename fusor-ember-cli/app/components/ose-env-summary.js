import Ember from 'ember';

export default Ember.Component.extend({

  resourcesAvailableToolTip: Ember.computed('cfmeVcpu', 'cfmeRam', 'cfmeDisk', function() {
    return `${this.get('cfmeVcpu')} vCPUs, ${this.get('cfmeRam')}GB RAM, ${this.get('cfmeDisk')}GB Disk reserved for CloudForms`;
  }),

  minTotalNodes: Ember.computed('oseDeploymentType', function() {
    return this.get('oseDeploymentType') === 'highly_available' ? 8 : 2;
  }),

  nodeInputHasError: Ember.computed('numTotalNodes', 'minTotalNodes', function() {
    let numTotalNodes = this.get('numTotalNodes');
    return numTotalNodes % 1 !== 0 || numTotalNodes <  this.get('minTotalNodes');
  }),

  imageStorageInputHasError: Ember.computed('storageSize', function() {
    let storageSize = this.get('storageSize');
    return storageSize % 1 !== 0 || storageSize <  1;
  }),

  actions: {
    oseLocationChanged() {
      this.sendAction('oseLocationChanged', this.get('oseLocation'));
    }
  }
});
