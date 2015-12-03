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
         "question": {
           "questionText": this.get('question')
         }
       };
       _this.set('watsonResponse', 'loading');
        //alert(JSON.stringify(data));
      Ember.$.ajax({
        url: "https://dal09-gateway.watsonplatform.net/instance/556/deepqa/v1/question",
        data: JSON.stringify(data),
        headers: {
          'X-SyncTimeout': '30',
          'Accept': 'application/json',
          'Authorization': 'Basic bHN1X3N0dWRlbnQxMjpIVFlveVBxSQ==',
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
