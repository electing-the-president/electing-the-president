import DS from 'ember-data';
import SailsRESTAdapter from 'ember-data-sails/adapters/sails-rest';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default SailsRESTAdapter.extend(DataAdapterMixin, {
  authorizer: 'authorizer:basic',
  host: 'http://localhost:1337'//'http://electing-the-president.mybluemix.net'
});
