import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  credentials: Ember.Object.create({
    email: null,
    password: null
  }),
  actions: {
    register() {
      if(this.get('credentials.email') && this.get('credentials.password')){
        this.send('registerUser', this.get('credentials'));
      }
    }
  }
});
