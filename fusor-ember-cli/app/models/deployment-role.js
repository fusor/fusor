import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  version: DS.attr('number'),

  countParameterName: function() {
      return this.get('name') + '-' + this.get('version') + '::count'
  }.property('name', 'version')
});
