import Ember from 'ember';

export default Ember.Component.extend({
  linkLabel: Ember.computed('oseHost', function () {
    const extractionRegex = /ose-(master|node)(\d+)\./;
    const hostName = this.get('oseHost.name');
    const match = hostName.match(extractionRegex);

    if(!match) {
      throw "ASSERTION FAILED: Failed to extract regex from host name.";
    }

    const labelPrefix = match[1] === 'master' ? 'Master' : 'Node';
    const hostId = match[2];

    return `${labelPrefix} ${hostId}`;
  }),
  linkValue: Ember.computed('oseHost', function() {
    return `https://${this.get('oseHost.name')}:8443`;
  }),
  linkIp: Ember.computed('oseHost', function() {
    return `https://${this.get('oseHost.ip')}:8443`;
  })
});
