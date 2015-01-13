import DS from 'ember-data';

var Location = DS.Model.extend({
  name: DS.attr('string'),
  title: DS.attr('string')
});

Location.reopenClass({
    FIXTURES: [
        {
          id: 1,
          name: 'Tel Aviv',
          title: 'Tel Aviv',
       },
       {
          id: 2,
          name: 'Brno',
          title: 'Brno',
       },
       {
          id: 3,
          name: 'Raleigh',
          title: 'Raleigh',
       }
  ]
});

export default Location;