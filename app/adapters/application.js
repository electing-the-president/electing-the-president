import DS from 'ember-data';
import SailsRESTAdapter from 'ember-data-sails/adapters/sails-rest';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from 'electing-the-president/config/environment';

export default SailsRESTAdapter.extend(DataAdapterMixin, {
  authorizer: 'authorizer:basic',
  host: ENV.apiEndPoint//'http://electing-the-president.mybluemix.net'
});
