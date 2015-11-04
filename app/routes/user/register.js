import Ember from 'ember';
import ENV from 'electing-the-president/config/environment';

export default Ember.Route.extend({
  session: Ember.inject.service('session'),
  actions: {
    registerUser: function(userInfo) {
      let _this = this;
      let { email, password } = userInfo.getProperties('email', 'password');

      Ember.$.ajax({
        type: "POST",
        url: ENV.apiEndPoint + '/users',
        data: {
          email: email,
          password: password
        },
        success: function() {
          _this.get('session').authenticate('authenticator:basic', email, password).catch((reason) => {
            _this.set('errorMessage', reason.error);
          });
        },
        dataType: 'json'
      }).fail(function() {
        alert("error");
      });
    }
  }
});
