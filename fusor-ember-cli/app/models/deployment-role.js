import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),
  version: DS.attr('number'),

  countParameterName: function() {
      return this.get('name') + '-' + this.get('version') + '::count'
  }.property('name', 'version'),
  flavorParameterName: function() {
      return this.get('name') + '-' + this.get('version') + '::Flavor'
  }.property('name', 'version'),

  roleType: function() {
    var name = this.get('name').toLowerCase();
    if (name.indexOf('controller') >= 0) {
      return 'controller';
    }
    else if (name.indexOf('compute') >= 0) {
      return 'compute';
    }
    else if (name.indexOf('cinder') >= 0) {
      return 'block';
    }
    else if (name.indexOf('swift') >= 0) {
      return 'object';
    }
    else if (name.indexOf('ceph') >= 0) {
      return 'block';
    }

    return name;
  }.property('name')
});
