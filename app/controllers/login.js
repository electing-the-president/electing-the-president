// app/controllers/login.js
import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  identity: null,
  password: null,
  actions: {
    authenticate() {
      let { identity, password } = this.getProperties('identity', 'password');
      this.get('session').authenticate('authenticator:basic', identity, password).catch((reason) => {
        this.set('errorMessage', reason.error);
      });
    }
  }
});
