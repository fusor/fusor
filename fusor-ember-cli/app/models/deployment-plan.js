import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    uuid: DS.attr('string'),
    roles: DS.hasMany('deployment-role', {inverse: null, async: false}),
    parameters: DS.hasMany('deployment-plan-parameter', {inverse: null, async: false})
});
