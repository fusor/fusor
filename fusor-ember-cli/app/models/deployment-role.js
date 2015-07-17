import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),
  version: DS.attr('number'),

  parameterPrefix: function() {
      return this.get('name') + '-' + this.get('version') + '::';
  }.property('name', 'version'),

  countParameterName: function() {
      return this.get('parameterPrefix') + 'count';
  }.property('name', 'version'),

  flavorParameterName: function() {
      return this.get('parameterPrefix') + 'Flavor';
  }.property('name', 'version'),

  imageParameterName: function() {
      return this.get('parameterPrefix') + 'Image';
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
