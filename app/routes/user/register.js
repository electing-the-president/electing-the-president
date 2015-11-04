import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service('session'),
  actions: {
    registerUser: function(userInfo){
      let { email, password } = userInfo.getProperties('email', 'password');
      let user = this.store.createRecord('user', {
        email: email,
        password: password
      });
      user.save().then(function(user){
        this.get('session').authenticate('authenticator:basic', user.email, password).catch((reason) => {
          this.set('errorMessage', reason.error);
        });
      });
    }
  }
});
