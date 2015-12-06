import Ember from 'ember';

export default Ember.Controller.extend({
  question: '',
  watsonResponse: null,
  loading: function(){
    return this.get('watsonResponse') === 'loading';
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
        //url: "https://elthpr.mybluemix.net/ask",
        url: "http://localhost:1337/ask",
        data: JSON.stringify(data),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        dataType: 'json',
        success: function(s) {
          //alert(s);
          var headingRegex = /<h1.*>([^:]*).*<\/h1>/i;
          //var bodyRegex = /.*<\/h1>(.*$)*/im;
          var answers = [];
          var answer, matches;
          for(var i=0;i<s.question.answers.length;++i){
            if(s.question.answers[i].text === '${noAnswer}') {
              continue;
            }

            answer = s.question.answers[i];
            matches = answer.formattedText.match(headingRegex);
            console.log(matches.length, JSON.stringify(matches));
            if(matches.length === 2) {
              answer.heading = matches[1];
            }
            //matches = answer.formattedText.match(bodyRegex);
            console.log(matches.length, JSON.stringify(matches));
            //if(matches.length === 2) {
              answer.body = answer.formattedText.substring(matches[0].length, answer.formattedText.length);
            //}
            answers.push(answer);
            console.log(JSON.stringify(answer));
          }
          console.log(answers);
          s.question.answers = answers;
            _this.set('watsonResponse', s);
            _this.set('question', '');
        }
      });
    }
  }
});
