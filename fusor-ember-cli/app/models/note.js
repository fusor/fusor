import DS from 'ember-data';

var Note = DS.Model.extend({
  route: DS.attr('string'),
  desc: DS.attr('string')
});

Note.reopenClass({
    FIXTURES: [
        {
          id: 1,
          route: 'rhev',
          desc: 'we are in the RHEV route'
       },
       {
          id: 2,
          route: 'satellite',
          desc: 'we are in the satellite route'
       },
       {
          id: 3,
          route: 'configure',
          desc: ' configure'
       }
  ]
});

export default Note;