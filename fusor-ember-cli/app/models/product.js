import DS from 'ember-data';

var Product = DS.Model.extend({
  name: DS.attr('string'),
  state_time: DS.attr('string'),
  duration: DS.attr('string'),
  size: DS.attr('string'),
  result: DS.attr('string'),
});

Product.reopenClass({
    FIXTURES: [
        {
          id: 1,
          name: 'Red Hat Enterprise Virtualization',
          state_time: null,
          duration: '25 minutes',
          size: '3 GB',
          result: 'Sync in progress',
       },
       {
          id: 2,
          name: 'Red Hat CloudForms Management Engine',
          state_time: null,
          duration: '14 minutes',
          size: '1 GB',
          result: 'Sync in progress',
       },
       {
          id: 3,
          name: 'Red Hat OpenStack Platform',
          state_time: null,
          duration: '22 minutes',
          size: '2 GB',
          result: 'Sync in progress',
       }
  ]
});

export default Product;
