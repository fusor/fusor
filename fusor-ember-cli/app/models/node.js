import DS from 'ember-data';

export default DS.Model.extend({
    uuid: DS.attr('string'),
    driver: DS.attr('string'),
    provision_state: DS.attr('string'),
    driver_info: DS.attr(),
    properties: DS.attr(),
    address: DS.attr('string'),
});


