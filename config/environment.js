/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'electing-the-president',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
      SAILS_LOG_LEVEL: 'debug',
 emberDataSails:  {
   // default is to use same host and port as the ember app:
   //host: '//localhost:1337',
   // this is the default and is the path to the sails io script:
   //scriptPath: '/js/dependencies/sails.io.js'
 }
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.apiEndPoint = 'http://localhost:1337';
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;
    ENV.apiEndPoint = 'http://localhost:1337';

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.apiEndPoint = 'https://electing-the-president.mybluemix.net';
  }

  return ENV;
};
