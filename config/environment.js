/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'electing-the-president',
    environment: environment,
    baseURL: '/',
    defaultLocationType: 'hash',
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
      emberDataSails: {
        // default is to use same host and port as the ember app:
        //host: '//localhost:1337',
        // this is the default and is the path to the sails io script:
        //scriptPath: '/js/dependencies/sails.io.js'
      }
    }
  };

  ENV.cordova = {
    // Rebuild the cordova project on file changes. Blocks the server until it's
    // finished.
    //
    // default: false
    //rebuildOnChange: true,

    // Run the cordova emulate command after the build is finished
    //
    // default: false
    //emulate: true,

    // Which platform to build and/or emulate
    //
    // default: 'ios'
    platform: 'android',

    // Which URL the ember server is running on. This is used when using
    // live-reload that comes with the starter kit.
    //
    // default: 'the-device-ip:4200'
    //emberUrl: 'http://10.0.1.12:4200',

    // Whether or not to use liveReload on the device simulator. Requires a few
    // plugins to be installed that come with the starter-kit. It will cause your
    // app to not boot up in the browser
    //
    // default: false and iOS
    liveReload: {
      enabled: false,
      platform: 'android'
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
    ENV.apiEndPoint = 'https://elthpr.mybluemix.net';
  }

  return ENV;
};
