import Ember from 'ember';

export default Ember.Mixin.create({
  meta: function() {
    return this.store.metadataFor(this.get('model').type);
  }.property('')
});
