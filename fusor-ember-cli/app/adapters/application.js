import DS from 'ember-data';
import Ember from 'ember';

var token = Ember.$('meta[name="csrf-token"]').attr('content');
export default DS.ActiveModelAdapter.extend({
    namespace: 'api/v21',
    headers: {
        "X-CSRF-Token": token
    },
    shouldReloadRecord(store, ticketSnapshot) {
      return true;
    }

});
