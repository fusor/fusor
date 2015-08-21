import DS from 'ember-data';

export default DS.Model.extend({
    uuid: DS.attr('string'),
    roles: DS.hasMany('deployment-role', { inverse: null }),
    parameters: DS.hasMany('deployment-plan-parameter', { inverse: null })
});
