/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'fusor-ember-cli',
    environment: environment,
    baseURL: '/',
    locationType: 'hash',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },
    // contentSecurityPolicy: {
    //   'default-src': "*",
    //   'script-src': "*",
    //   'font-src': "*",
    //   'connect-src': "*",
    //   'img-src': "*",
    //   'style-src': "*",
    //   'frame-src': "*"
    // },
    //contentSecurityPolicyHeader: 'Content-Security-Policy',
    contentSecurityPolicyHeader: 'Disabled-Content-Security-Policy',

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    ENV.APP.LOG_ACTIVE_GENERATION = true;
    ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.APP.rootElement = "#ember-app";
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.APP.rootElement = "#ember-app";
  }

  return ENV;
};
