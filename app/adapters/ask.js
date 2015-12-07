import SailsSocketAdapter from 'ember-data-sails/adapters/sails-socket';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from 'electing-the-president/config/environment';

export default SailsSocketAdapter.extend({
  authorizer: 'authorizer:basic',
  host: ENV.apiEndPoint,
  /**
   * Whether to use CSRF tokens or not
   */
  //useCSRF:              true,
  /**
   * The path to use when the CSRF token needs to be retrieved
   * Default is `/csrfToken`, if not heading `/` it'll be relative to `namespace`
   */
  //csrfTokenPath: 'some/custom/path',
  /**
   * Whether to group multiple find by ID with one request with a `where`
   */
  coalesceFindRequests: true,
  /**
   * The namespace of your API
   */
  //namespace:            'api/v1'
});
