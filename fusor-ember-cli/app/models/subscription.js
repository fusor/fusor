import DS from 'ember-data';

var Subscription = DS.Model.extend({
  name: DS.attr('string'),
  contract_number: DS.attr('string'),
  available: DS.attr('string'),
  subscription_type: DS.attr('string'),
  start_date: DS.attr('date'),
  end_date: DS.attr('date'),
  quantity: DS.attr('number')
});

Subscription.reopenClass({
    FIXTURES: [
        {
         id: 1,
         name: 'Red Hat Employee Subscription',
         contract_number: '1234567',
         available: '12831 of 25000',
         subscription_type: 'System: Physical',
         start_date: '03/03/2014',
         end_date: '01/01/2022',
         quantity: null
       },
       {
         id: 2,
         name: '30 Day Self-Supported OpenShift Enterprise, 2 Cores Evaluation',
         contract_number: '234234234',
         available: '2 or 3',
         subscription_type: 'System: Physical',
         start_date: '09/01/2014',
         end_date: '09/30/2014',
         quantity: 1
       },
       {
         id: 3,
         name: 'CloudForms Employee Subscription',
         contract_number: '675676576',
         available: '2 or 1000',
         subscription_type: 'System: Physical',
         start_date: '07/01/2014',
         end_date: '07/30/2019',
         quantity: null
       }
  ]
});

export default Subscription;
