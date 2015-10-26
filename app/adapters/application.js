import DS from 'ember-data';
import SailsRESTAdapter from 'ember-data-sails/adapters/sails-rest';


export default SailsRESTAdapter.extend({
  host: 'http://electing-the-president.mybluemix.net'
});
