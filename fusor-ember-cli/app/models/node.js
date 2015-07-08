import DS from 'ember-data';

export default DS.Model.extend({
    driver: DS.attr('string'),
    driver_info: DS.attr(),
    properties: DS.attr(),
    address: DS.attr('string'),
});


