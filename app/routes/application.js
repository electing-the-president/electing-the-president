// app/routes/application.js
import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend({
  ApplicationRouteMixin,
  actions: {
    willTransition: (t) => {
      Ember.$('#navbarMenu').collapse('hide');
      Ember.$("#mobileMenu").data("mmenu").close();
    }
  }
});
