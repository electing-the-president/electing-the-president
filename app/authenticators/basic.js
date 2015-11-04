import Ember from 'ember';
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';
import ENV from 'electing-the-president/config/environment';

export default BaseAuthenticator.extend({
  serverTokenEndpoint: ENV.apiEndPoint + '/user',
  /**
    Restores the session from a session data object. __This method is invoked
    by the session either on application startup if session data is restored
    from the session store__ or when properties in the store change due to
    external events (e.g. in another tab) and the new session data needs to be
    validated for whether it constitutes an authenticated session.
    __This method returns a promise. A resolving promise results in the session
    becoming or remaining authenticated.__ Any data the promise resolves with
    will be saved in and accessible via the session service's
    `data.authenticated` property (see
    {{#crossLink "SessionService/data:property"}}{{/crossLink}}). A rejecting
    promise indicates that `data` does not constitute a valid session and will
    result in the session being invalidated or remaining unauthencicated.
    The `BaseAuthenticator`'s implementation always returns a rejecting
    promise. __This method must be overridden in subclasses.__
    @method restore
    @param {Object} data The data to restore the session from
    @return {Ember.RSVP.Promise} A promise that when it resolves results in the session becoming or remaining authenticated
    @public
  */
  restore(data) {
    const user = Ember.get(data, 'identity');
    const pass = Ember.get(data, 'password');
    return new Ember.RSVP.Promise((resolve, reject) => {
      if (!Ember.isEmpty(user) && !Ember.isEmpty(pass)) {
        resolve(data);
      } else {
        reject();
      }
    });
  },
  /**
    Authenticates the session with the specified `args`. These options vary
    depending on the actual authentication mechanism the authenticator
    implements (e.g. a set of credentials or a Facebook account id etc.). __The
    session will invoke this method in order to authenticate itself__ (see
    {{#crossLink "SessionService/authenticate:method"}}{{/crossLink}}).
    __This method returns a promise. A resolving promise will result in the
    session becoming authenticated.__ Any data the promise resolves with will
    be saved in and accessible via the session service's `data.authenticated`
    property (see {{#crossLink "SessionService/data:property"}}{{/crossLink}}).
    A rejecting promise indicates that authentication failed and will result in
    the session remaining unauthenticated.
    The `BaseAuthenticator`'s implementation always returns a rejecting promise
    and thus never authenticates the session. __This method must be overridden
    in subclasses__.
    @method authenticate
    @param {Any} [...args] The arguments that the authenticator requires to authenticate the session
    @return {Ember.RSVP.Promise} A promise that when it resolves results in the session becoming authenticated
    @public
  */
  authenticate(identification, password) {
   return new Ember.RSVP.Promise((resolve, reject) => {
     var data         = {};
     data['identity'] = identification;
     data['password'] = password;

     console.log(window.btoa(data.identity + ':' + data.password));
     var serverTokenEndpoint = this.get('serverTokenEndpoint');
     $.ajaxSetup({
    headers: { 'Authorization': 'Basic ' + window.btoa(data.identity + ':' + data.password) }
});
     Ember.$.ajax({
       url:      serverTokenEndpoint,
       type: 'GET',
       beforeSend: function(xhr) {
         xhr.setRequestHeader('Authorization', 'Basic ' + window.btoa(data.identity + ':' + data.password));
       }
     }).then(function(response) {
       console.log(response);
       data.user = response;
       Ember.run(null, resolve, data);
     }, function(xhr) {
       console.log(xhr.responseJSON || xhr.responseText);
       Ember.run(null, reject, xhr.responseJSON || xhr.responseText);
     });
   });
 },

  /**
    This method is invoked as a callback when the session is invalidated. While
    the session will invalidate itself and clear all authenticated session data,
    it might be necessary for some authenticators to perform additional tasks
    (e.g. invalidating an access token on the server side).
    __This method returns a promise. A resolving promise will result in the
    session becoming unauthenticated.__ A rejecting promise will result in
    invalidation being intercepted and the session remaining authenticated.
    The `BaseAuthenticator`'s implementation always returns a resolving promise
    and thus never intercepts session invalidation. __This method doesn't have
    to be overridden in custom authenticators__ if no actions need to be
    performed on session invalidation.
    @method invalidate
    @param {Object} data The current authenticated session data
    @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being invalidated
    @public
  */
  invalidate() {
    return Ember.RSVP.resolve();
  },

});
