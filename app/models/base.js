import DS from 'ember-data';

export default DS.Model.extend({
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),
  createdOrUpdated: function(){
    return this.get('updatedAt') || this.get('createdAt');
  }.property('createdAt', 'updatedAt')
});
