import Ember from 'ember';
import ENV from 'electing-the-president/config/environment';

export default Ember.Controller.extend({
  question: '',
  watsonResponse: null,
  error: false,
  loading: function() {
    return this.get('watsonResponse') === 'loading' && this.get('error') === false;
  }.property('watsonResponse', 'error'),
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
    submitQuestion: function(q) {
      var _this = this;
      if (q) {
        this.set('question', q);
      }
      var data = {
        "question": this.get('question')
      };
      _this.set('error', false);
      _this.set('watsonResponse', 'loading');
      try {
        //alert(JSON.stringify(data));
        Ember.$.ajax({
          url: ENV.apiEndPoint + '/ask',
          data: JSON.stringify(data),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: "POST",
          dataType: 'json',
          error: function(xhr, status, message) {
            _this.set('error', {
              status: status.charAt(0).toUpperCase() + status.slice(1),
              message: message
            });
          },
          success: function(s) {

            var headingRegex = /<h1.*>([^:]*).*<\/h1>/i;
            //var bodyRegex = /.*<\/h1>(.*$)*/im;
            var answers = [];
            var answer, matches;
            for (var i = 0; i < s.question.answers.length; ++i) {
              if (s.question.answers[i].text === '${noAnswer}') {
                continue;
              }
              answer = s.question.answers[i];
              matches = answer.formattedText.match(headingRegex);
              if (matches) {
                //console.log(matches.length, JSON.stringify(matches));
                if (matches.length === 2) {
                  answer.heading = matches[1];
                }
                //console.log(matches.length, JSON.stringify(matches));
                answer.body = answer.formattedText.substring(matches[0].length, answer.formattedText.length);
              } else {
                answer.heading = 'Answer';
                answer.body = answer.formattedText;
              }
              answers.push(answer);
              //console.log(JSON.stringify(answer));
            }
            console.log(answers);
            s.question.answers = answers;
            _this.set('watsonResponse', s);
          }
        });
      } catch (e) {
        // statements to handle any exceptions
        _this.set('error', e.message);
      } finally {
        _this.set('question', '');
      }
    }
  }
});
