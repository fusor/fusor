import Ember from 'ember';

export function initialize(application) {

  let factoryName = 'event-bus:main';
  let injectedProp = 'eventBus';
  application.register('event-bus:main', Ember.Object.extend(Ember.Evented));
  ['adapter', 'component', 'controller', 'route'].map((target) => {
    application.inject(target, injectedProp, factoryName);
  });
}

export default {
  name: 'event-bus',
  initialize
};
