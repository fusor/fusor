import DS from 'ember-data';

export default DS.Model.extend({
    stack_status: DS.attr('string'),
    stack_status_reason: DS.attr('string')
});
