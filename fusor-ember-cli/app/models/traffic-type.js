import DS from 'ember-data';

var trafficType = DS.Model.extend({
  name: DS.attr('string'),
  subnets: DS.hasMany('subnet', { async: true })
});

trafficType.reopenClass({
    FIXTURES: [
        {
          id: 1,
          name: 'External',
       },
       {
          id: 2,
          name: 'Tenant',
       },
       {
          id: 3,
          name: 'Management',
       },
       {
          id: 4,
          name: 'Cluster Management',
       },
       {
          id: 5,
          name: 'Admin API',
       },
       {
          id: 6,
          name: 'Public API',
       },
       {
          id: 7,
          name: 'Storage',
       },
       {
          id: 8,
          name: 'Storage Clustering',
       },
  ]
});

export default trafficType;
