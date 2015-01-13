import DS from 'ember-data';

var Deployment = DS.Model.extend({
  name: DS.attr('string'),
  organization: DS.attr('string'),
  environment: DS.attr('string'),
});

Deployment.reopenClass({
    FIXTURES: [
        {
          id: 1,
          name: 'My first RHEV',
          organization: 'default_organization',
          environment: 'development',
       },
       {
          id: 2,
          name: 'My second RHEV and CloudForms',
          organization: 'default_organization',
          environment: 'staging',
       },
       {
          id: 3,
          name: 'Going Live RHEV and CloudForms',
          organization: 'default_organization',
          environment: 'production',
       }
  ]
});

export default Deployment;
