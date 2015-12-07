import Ember from 'ember';
import ENV from 'electing-the-president/config/environment';

export default Ember.Route.extend({
  sailsSocket: Ember.inject.service(),
  setupController: function(controller, model){
    controller.set('model', model);
  },
  model: function(){
    return this.store.findAll('ask');//findAll('ask');//this.sailsSocket.request('get', ENV.apiEndPoint+'/ask');//.then(function(response) {
    // do something with the response
  //});//this.store.subscribe('ask');
  },
});
