import Ember from 'ember';

export default Ember.Controller.extend({
  question: '',
  watsonResponse: null,
  loading: function(){
    return this.get('question') === 'loading';
  }.property('watsonResponse'),
  actions: {
    submitQuestion: function() {
      var _this = this;
      var data = {
         "question": this.get('question')
       };
       _this.set('watsonResponse', 'loading');
        //alert(JSON.stringify(data));
      Ember.$.ajax({
        url: "https://elthpr.mybluemix.net/ask",
        data: JSON.stringify(data),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        method: "POST",
        dataType: 'json',
        success: function(s) {
          //alert(s);
          _this.set('watsonResponse', s);
          _this.set('question', '');
        }
      });
    },
    insertNewline: function() {
      Ember.$('#id_button').click();
    }
  }
});
