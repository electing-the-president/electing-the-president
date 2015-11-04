import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller, model){
    controller.set('model', this.modelFor('admin.permission'));
    //this._super(controller, model);
  }
});
