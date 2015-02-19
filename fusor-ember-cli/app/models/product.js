import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  state_time: DS.attr('string'),
  duration: DS.attr('string'),
  size: DS.attr('string'),
  result: DS.attr('string'),
});
