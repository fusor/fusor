import DS from 'ember-data';

export default DS.Model.extend({
    description: DS.attr('string'),
    value: DS.attr('string'),
    hidden: DS.attr('boolean'),
    parameter_type: DS.attr('string')
});
