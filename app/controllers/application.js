import Ember from 'ember';
import ENV from 'electing-the-president/config/environment';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  thinking: false,
  scrollChat: function() {
    var height = 0;
    Ember.$('#qa-chatbox-div ul').each(function(i, value) {
      height += parseInt(Ember.$(this).height());
    });
    height += '';
    Ember.$('#qa-chatbox-div').animate({
      scrollTop: height
    });
  },
  showChat: function(){
    Ember.$('#collapseChat').collapse('show');
    this.scrollChat();
  },
  toggleChat: function(){
    Ember.$('#collapseChat').collapse('toggle');
    this.scrollChat();
  },
  watsonSay: function(message) {
    Ember.$('#qa-chatbox').append(`<li class="right clearfix">
      <span class="chat-img pull-right">
        <span class="glyphicon glyphicon-scale"></span></small>
      </span>
      <div class="chat-body clearfix">
        <div class="header">
        <small class=" text-muted">
                      <span class="glyphicon glyphicon-envelope"></span></small>
          <strong class="pull-right primary-font">Watson</strong>
        </div>
        <p>
          ${message}
        </p>
      </div>
    </li>`);
    this.set('thinking', false);
    this.showChat();
  },
  submitQuestion: function(q) {
    var _this = this;
    if (q) {
      this.set('question', q);
    }
    var data = {
      question: this.get('question')
    };
    _this.set('thinking', true);
    try {
      //alert(JSON.stringify(data));
      Ember.$.ajax({
        url: ENV.apiEndPoint + '/asks/question',
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
          var answer, matches;
          var i = 0;
          while(i < s.question.answers.length && s.question.answers[i].text === '${noAnswer}'){
            ++i;
          }
          if(i >= s.question.answers.length || s.question.answers[i].text === '${noAnswer}'){
            _this.watsonSay('Sorry, I don\'t know the answer.');
          } else {
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
            if(i > 0) {
              answer.body = '<p>I\'m not certain, but here goes nothing:</p>' + answer.body;
            }
            _this.watsonSay(answer.body);
          }
        }
      });
    } catch (e) {
      // statements to handle any exceptions
      _this.watsonSay('Oh, no! Something is wrong, and I can\'t think straight. If this doesn\'t fix itself soon, you should probably grab one of my developers!');
    } finally {
      _this.set('question', '');
    }
  },
  actions: {
    invalidateSession() {
        this.get('session').invalidate();
      },
      askWatson: function(question) {
        if (!question) {
          question = this.get('question');
        }
        if(!question || question === '') {
          return;
        }
        Ember.$('#qa-chatbox').append(`<li class="left clearfix">
        <span class="chat-img pull-left">
          <span class="glyphicon glyphicon-user" aria-hidden="true"></span>
        </span>
        <div class="chat-body clearfix">
          <div class="header">
            <strong class="primary-font">You</strong>
            <small class="pull-right text-muted">
              <span class="glyphicon glyphicon-envelope"></span></small>
          </div>
          <p>
             ${question}
          </p>
        </div>
      </li>`);
        this.showChat();
        this.submitQuestion(question);
      },
      showChat: function(){
        this.showChat();
      },
      toggleChat: function(){
this.toggleChat();
      }
  }
});
