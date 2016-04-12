import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'div',
  classNames: ['ose-env-summary'],

  resourcesAvailableToolTip: Ember.computed('cfmeVcpu', 'cfmeRam', 'cfmeDisk', function() {
    return `${this.get('cfmeVcpu')} vCPUs, ${this.get('cfmeRam')}GB RAM, ${this.get('cfmeDisk')}GB Disk reserved for CloudForms`;
  })

});
