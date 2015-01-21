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
    simpleAuth: {
      //https://github.com/simplabs/ember-simple-auth/blob/master/packages/ember-simple-auth/lib/simple-auth/configuration.js
      // authenticationRoute:         'login',
      // routeAfterAuthentication:    'index',
      // routeIfAlreadyAuthenticated: 'loggedin',
      routeAfterAuthentication:    'rhci',
      routeIfAlreadyAuthenticated: 'rhci',
      // sessionPropertyName:         'session',
      // authorizer:                  null,
      authorizer: 'simple-auth-authorizer:oauth2-bearer',
      // session:                     'simple-auth-session:main',
      store: 'simple-auth-session-store:local-storage',
      // localStorageKey:             'ember_simple_auth:session',
      crossOriginWhitelist: ['http://localhost:3000', 'https://foreman.sat.lab.tlv.redhat.com'],
      // applicationRootUrl:          null
    },
    simpleAuthOauth2: {
      serverTokenEndpoint: '/oauth/token'
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

    torii: {
      providers: {
        'facebook-connect': {
          appId: '394152887290151'
        },
        'facebook-oauth2': {
          apiKey: '394152887290151',
          redirectUri: 'http://0.0.0.0:4200'
        },
        'google-oauth2': {
          apiKey: '586079650480-rgupqq2ss2bnebii11gakbu1a735tru9.apps.googleusercontent.com',
          redirectUri: 'http://localhost:4200'
        },
        'github-oauth2': {
          apiKey: '9571e28a208605ba2a6e'
        }
      }
    },
    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  ENV['simple-auth-oauth2'] = {
    serverTokenEndpoint: '/oauth/token'
  }

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
