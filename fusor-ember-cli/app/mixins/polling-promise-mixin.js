import Ember from 'ember';

export default Ember.Mixin.create({

  onPollInterval: 5000, //default of 5 seconds

  schedulePoll(fname) {
    let names = this.getNames(fname);
    let f = this.get(names.pollingFunction);
    let interval = Ember.isPresent(this.get(names.interval)) ? this.get(names.interval) : this.get('onPollInterval');

    if (!f) {
      throw new Error(`Polling function "${names.pollingFunction}" not found.`);
    }

    if (this.get(names.started)){
      Ember.run.later(this, function() {
        f.apply(this).then(() => {
          this.set(names.timer, this.schedulePoll(names.pollingFunction));
        });
      }, interval);
    }
  },

  startPolling(fname) {
    let names = this.getNames(fname);

    this.set(names.started, true);
    this.set(names.timer, this.schedulePoll(names.pollingFunction));
  },

  stopPolling(fname) {
    let names = this.getNames(fname);

    this.set(names.started, false);
    Ember.run.cancel(this.get(names.timer));
  },

  getNames(fname) {
    let functionName = fname || 'onPoll';

    return {
      pollingFunction: functionName,
      started: `${functionName}Started`,
      timer: `${functionName}Timer`,
      interval: `${functionName}Interval`
    };
  }

});
