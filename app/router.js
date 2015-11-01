import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('questions', function() {
    this.route('index');
  });
  this.route('login');

  this.route('users', function() {
    this.route('modify');
    this.route('create');
    this.route('show');
  });

  this.route('admin', function() {
    this.route('models', function() {
      this.route('index');
    });
    this.route('roles', function() {
      this.route('index');
    });
    this.route('permissions', function() {
      this.route('index');
    });
  });

});

export default Router;
