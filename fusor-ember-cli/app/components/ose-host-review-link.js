import Ember from 'ember';

export default Ember.Component.extend({
  linkLabel: Ember.computed('_infoObj', function () {
    const info = this.get('_infoObj');
    const labelPrefix = info.get('labelPrefix');
    const hostId = info.get('hostId');

    return `${labelPrefix} ${hostId}`;
  }),
  linkValue: Ember.computed('oseHost', function() {
    return `https://${this.get('oseHost.name')}:8443`;
  }),
  isWorkerNode: Ember.computed('_infoObj', function() {
    const info = this.get('_infoObj');
    return info.get('labelPrefix') === 'Node';
  }),
  // Internal
  _infoObj: Ember.computed('oseHost', function() {
    const extractionRegex = /ose-(master|node)(\d+)\./;
    const hostName = this.get('oseHost.name');
    const match = hostName.match(extractionRegex);

    if(!match) {
      throw "ASSERTION FAILED: Failed to extract regex from host name.";
    }

    return Ember.Object.create({
      labelPrefix: match[1] === 'master' ? 'Master' : 'Node',
      hostId: match[2]
    });
  })
});
