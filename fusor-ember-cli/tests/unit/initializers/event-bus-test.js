import Ember from 'ember';
import EventBusInitializer from '../../../initializers/event-bus';
import { module, test } from 'qunit';

let application;
let factoryName = 'event-bus:main';
let injectionName = 'eventBus';

module('Unit | Initializer | event bus', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      reg = application.registry;
      application.deferReadiness();
    });
  }
});

test('app instance is non-null', function(assert) {
  EventBusInitializer.initialize(reg, application);
  assert.ok(application);
});

test('event-bus registration', function(assert) {
  EventBusInitializer.initialize(application.registry, application);
  assert.ok(reg['registrations'][factoryName]);
});

test('event-bus injection', function(assert) {
  assert.expect(4);

  EventBusInitializer.initialize(application.registry, application);

  let assertInjection = (target) => {
    assert.ok(reg['_typeInjections'][target].find((type) => {
      return type['fullName'] === factoryName &&
        type['property'] === injectionName;
    }));
  };

  ['adapter', 'component', 'controller', 'route'].map(assertInjection);
});

