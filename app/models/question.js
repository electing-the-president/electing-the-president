import DS from 'ember-data';

export default DS.Model.extend({
  text: DS.attr('string'),
  status: DS.attr('string'),
  createdAt: DS.attr('date'),
  updateddAt: DS.attr('date')
});
