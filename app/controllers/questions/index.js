import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ["page", "perPage"],
  perPage: 15,
  currentPage: 1,
  totalPages: function() {
    return Math.floor(this.get('sortedModel.length') / this.get('perPage')) + 1;
  }.property('sortedModel.length', 'perPage'),
  sortProperties: ['createdOrUpdated:desc'],
  sortedModel: Ember.computed.sort('model', 'sortProperties'),
  pagedModel: function() {
    var offset = (this.get('currentPage') - 1) * this.get('perPage');
    return this.get('sortedModel').slice(offset, offset + this.get('perPage'));
  }.property('sortedModel', 'currentPage', 'perPage'),
  modelChanged: Ember.observer('model.length', function() {
    this.set('currentPage', 1);
  }),
  actions: {
    askWatson: function(question) {
      if (!question) {
        question = this.get('question');
      }
      if (!question || question === '') {
        return;
      }
      this.controllerFor('application').send('askWatson', question);
    },
  }
});
