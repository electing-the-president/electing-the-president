import DS from 'ember-data';

export default DS.Model.extend({
  createdAt: DS.attr('date'),
  updateddAt: DS.attr('date')
});
