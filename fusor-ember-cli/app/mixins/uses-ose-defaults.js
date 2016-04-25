import Ember from 'ember';

export default Ember.Mixin.create({
  shouldUseOseDefault(value) {
    return Ember.isBlank(value) || value <= 0;
  }
});

