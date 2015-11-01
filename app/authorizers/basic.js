// app/authorizers/oauth2.js
import Ember from 'ember';
import BaseAuthorizer from 'ember-simple-auth/authorizers/base';

export default BaseAuthorizer.extend({
  /**
    Includes the access token from the session data into the `Authorization`
    header as a Bearer token, e.g.:

    ```
    Authorization: Bearer 234rtgjneroigne4
    ```

    @method authorize
    @param {Object} data The data that the session currently holds
    @param {Function} block(headerName,headerContent) The callback to call with the authorization data; will receive the header name and header content as arguments
    @public
  */
  authorize: function(data, block) {
    var encoded = window.btoa(data.identity + ':' + data.password);
    console.log(encoded);
    if (!Ember.isEmpty(encoded)) {
      block('Authorization', 'Basic ' + encoded);
    } else {
      console.log(encoded);
    }
  }
});
