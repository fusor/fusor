import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  label: DS.attr('string'),
  pending: DS.attr('boolean'),
  humanized_name: DS.attr('string'),
  username: DS.attr('string'),
  started_at: DS.attr('string'),
  ended_at: DS.attr('string'),
  state: DS.attr('string'),
  result: DS.attr('string'),
  external_id: DS.attr('string'),
  progress: DS.attr('string'),
  humanized_errors: DS.attr('string'),
  humanized_output: DS.attr('string'),
  humanized_input: DS.attr('string'),
  repository: DS.attr('string'),
  taskUrl: Ember.computed('id', function() {
    return '/foreman_tasks/tasks/' + this.get('id');
  })
});
