import Ember from 'ember';

export default Ember.Controller.extend({
  showSideMenu: false,

  uxDefaultNote: 'Note: Please write notes on [etherpad](http://rhci.pad.engineering.redhat.com/wireframe-mtg-10-30-2014), since this pad is ready-only and will note save anything.\n\n',
  uxHeaderNote: '\n\n\n**UX Notes / Specs** for this route\n\n',
  uxHeaderTodo: '\n\n\n\n\n\n\n**UX Todos / Questions** for this route\n\n',
  uxNotes: 'none', //this should be overwritten by controller
  uxTodos: 'none', //this should be overwritten by controller
  uxNotesDisplay: function () {
    return this.get('uxDefaultNote') + this.get('uxHeaderNote') + this.get('uxNotes') + this.get('uxHeaderTodo') + this.get('uxTodos');
  }.property('uxNotes'),

  etherpadBaseUrl: 'http://rhci.pad.engineering.redhat.com/',
  etherpadName: '',
  etherpadUrl: function () {
    return this.get('etherpadBaseUrl') + this.get('etherpadName');
  }.property('etherpadName'),


  actions: {
    toggleSideMenu: function() {
      this.set('showSideMenu', this.toggleProperty('showSideMenu'));
    }
  }
});
