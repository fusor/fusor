import Ember from 'ember';

export default Ember.Mixin.create({

  intervalPolling: Ember.computed(function() {
    return 5000; // Time between refreshing (in ms)
  }).readOnly(),

  scheduleNextRefresh(f) {
    return Ember.run.later(this, function() {
      f.apply(this);
      this.set('timer', this.scheduleNextRefresh(f));
    }, this.get('intervalPolling'));
  },

  // executes `refreshModelOnRoute` for every intervalPolling.
  startPolling() {
    this.set('timer', this.scheduleNextRefresh(this.get('refreshModelOnRoute'))); //and then repeats
  },

  stopPolling() {
    Ember.run.cancel(this.get('timer'));
  },

  refreshModelOnRoute() {
    return this.send('refreshModelOnOverviewRoute');
  }

});
