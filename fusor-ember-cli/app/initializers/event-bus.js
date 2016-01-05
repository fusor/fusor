export function initialize(registry, application) {
  // NOTE: This interface can be confusing; be sure you are
  // operating on the object you expect to be. Newer versions of
  // Ember have deprecated the first param, and newer versions of ember-cli
  // will generate boilerplate in accordance. For ember v1.13.10,
  // we continue to be passed the registry and application seperately.
  //
  // Ref:
  // https://github.com/ember-cli/ember-cli/commit/00e25f7de8075cfa01bfdb582b16a2f5611b5912

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
