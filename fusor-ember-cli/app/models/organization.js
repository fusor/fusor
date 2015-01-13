import DS from 'ember-data';

var Organization = DS.Model.extend({
  name: DS.attr('string'),
  title: DS.attr('string')
});

Organization.reopenClass({
    FIXTURES: [
        {
          id: 1,
          name: 'Default_Organization',
          title: 'Default_Organization',
       },
       // {
       //    id: 2,
       //    name: 'Engineering',
       //    title: 'Engineering',
       // },
       // {
       //    id: 3,
       //    name: 'QA',
       //    title: 'QA',
       // }
  ]
});

export default Organization;