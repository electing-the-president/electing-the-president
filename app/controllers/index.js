import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    askWatson: function(question){
      if (!question) {
        question = this.get('question');
      }
      if(!question || question === '') {
        return;
      }
      this.controllerFor('application').send('askWatson', question);
    },
  }
});
