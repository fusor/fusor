import DS from 'ember-data';

export default DS.Model.extend({
  login: DS.attr('string'),
  mail: DS.attr('string'),
  firstname: DS.attr('string'),
  lastname: DS.attr('string'),
  admin: DS.attr('boolean'),
  auth_source_id: DS.attr('number'),
  lastLoginOn: DS.attr('date'),
  fullName: function() {
    return this.get('firstname') + ' ' + this.get('lastname');
  }.property('firstname', 'lastname')


});
