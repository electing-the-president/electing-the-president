// app/controllers/login.js
import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  credentials: Ember.Object.create({
    identity: null,
    password: null
  }),
  actions: {
    authenticate() {
      let { identity, password } = this.get('credentials').getProperties('identity', 'password');
      //console.log(identity, password);
      this.get('session').authenticate('authenticator:basic', identity, password).catch((reason) => {
        this.set('errorMessage', reason.error);
      });
    }
  }
});
