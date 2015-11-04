import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller, model){
    controller.set('model', this.modelFor('admin.permission'));
    //this._super(controller, model);
    this.store.find('model').then(function(Models){
      var modelOptions = [];
      Models.forEach(function(item){
        modelOptions.push({id: item.get('id'), label: item.get('name')});
      });
      controller.set('modelOptions', modelOptions);
    });
    this.store.find('role').then(function(Roles){
      controller.set('roleOptions', Roles);
    });
  }
});
