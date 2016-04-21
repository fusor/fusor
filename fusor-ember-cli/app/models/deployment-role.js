/** Currently out of date.  Osp 8 api is returning hard coded values
 * ['Controller', 'Compute', 'BlockStorage', 'ObjectStorage', 'CephStorage']
 *
 * We might need this role object again soon if they change their API call
 */

/*

import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),
  version: DS.attr('number'),

  parameterPrefix: Ember.computed('name', 'version', function() {
      return this.get('name') + '-' + this.get('version') + '::';
  }),

  countParameterName: Ember.computed('name', 'version', function() {
      return this.get('parameterPrefix') + 'count';
  }),

  flavorParameterName: Ember.computed('name', 'version', function() {
      return this.get('parameterPrefix') + 'Flavor';
  }),

  imageParameterName: Ember.computed('name', 'version', function() {
      return this.get('parameterPrefix') + 'Image';
  }),

  snakeCaseName: Ember.computed('name', function() {
    return this.get('name').toLowerCase().replace('-', '_');
  }),

  flavorDeploymentAttributeName: Ember.computed('snakeCaseName', function() {
    return `openstack_overcloud_${this.get('snakeCaseName')}_flavor`;
  }),

  countDeploymentAttributeName: Ember.computed('snakeCaseName', function() {
    return `openstack_overcloud_${this.get('snakeCaseName')}_count`;
  }),

  roleType: Ember.computed('name', function() {
    var name = this.get('name').toLowerCase();
    if (name.indexOf('controller') >= 0) {
      return 'controller';
    }
    else if (name.indexOf('compute') >= 0) {
      return 'compute';
    }
    else if (name.indexOf('cinder') >= 0) {
      return 'cinder';
    }
    else if (name.indexOf('swift') >= 0) {
      return 'swift';
    }
    else if (name.indexOf('ceph') >= 0) {
      return 'ceph';
    }

    return name;
  })
});

  */