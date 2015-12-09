import Ember from 'ember';
import ENV from 'electing-the-president/config/environment';

export default Ember.Controller.extend({
  userAuth: null,
  userInfo: null,
  userData: null,
  progress: 0,
  graphData: function() {
    var gData = [];
    var raw = this.get('userInsights.tree.children');
    var i = -1;
    while (raw[++i].name !== 'Big 5') {}
    console.log(raw[i]);
    raw = raw[i].children[0].children;
    for (var q = 0; q < raw.length; ++q) {
      //console.log(raw[q]);
      //console.log(raw[q].id);
      if (raw[q].id === "Conscientiousness_parent") {
        gData.push({
          axis: "Open",
          value: raw[q].percentage * 5
        });
      } else if (raw[q].id === "Conscientiousness") {
        gData.push({
          axis: "Conscientious",
          value: raw[q].percentage * 5
        });
      } else if (raw[q].id === "Extraversion") {
        gData.push({
          axis: "Extraverted",
          value: raw[q].percentage * 5
        });
      } else if (raw[q].id === "Agreeableness") {
        gData.push({
          axis: "Agreeable",
          value: raw[q].percentage * 5
        });
      } else if (raw[q].id === "Neuroticism") {
        gData.push({
          axis: "Neurotic",
          value: raw[q].percentage * 5
        });
      }
    }
    console.log(gData);
    return gData;
  }.property('userInsights'),
  formattedInsights: function() {
    var raw = this.get('userInsights');

    function formatTree(tree) {
      var formattedTree = {};
      for (var key in tree) {
        switch (key) {
          case 'children':
            formattedTree.children = tree.children.map(formatTree);
            break;
          case 'percentage':
          case 'sampling_error':
            formattedTree[key] = Math.round(tree[key] * 10000) / 100;
            break;
          default:
            if (tree.hasOwnProperty(key)) {
              formattedTree[key] = tree[key];
            }
        }
      }
      return formattedTree;
    }

    return {
      "id": raw.id,
      "source": raw.source,
      "word_count": raw.word_count,
      "processed_lang": raw.processed_lang,
      tree: formatTree(raw.tree)
    };
  }.property('userInsights'),
  userInsights: null,
  fetching: false,
  numPagesToFetch: 50,
  getInsights: function() {
    var _this = this;
    var request = {
      type: 'fb',
      typeId: _this.get('userInfo').id,
      rawInputText: _this.get('userData')
    };
    Ember.$.ajax({
      dataType: "json",
      url: ENV.apiEndPoint + '/insights/analyze',
      type: 'POST',
      data: request,
      success: function(response) {
        _this.set('userInsights', response);
      }
    });
  },
  actions: {
    getUserStatuses: function() {
      this.set('userData', null);
      var _this = this;
      var next = null;
      var totalPages = this.get('numPagesToFetch');
      var numPages = totalPages;
      var dataCollection = [];

      function finish() {
        console.log('All done!');
        _this.set('userData', dataCollection.join(' ').replace(/(\r\n|\n|\r)/gm,' '));
        _this.set('fetching', false);
        _this.getInsights();
      }

      function parseData(posts) {
        _this.set('progress', (totalPages - numPages) / totalPages * 100);
        if (posts && posts.paging && posts.paging.next) {
          next = posts.paging.next.replace(/limit=25/gi,'limit=100');
        } else {
          numPages = 0;
        }
        if (posts && posts.data) {
          for (let post of posts.data) {
            //console.log(post);
            if (post.message) {
              if(Array.isArray(dataCollection)){
                dataCollection.push(post.message);
              } else {
                dataCollection = dataCollection + post.message.replace(/(\r\n|\n|\r)/gm,' ');
              }
            }
          }
        }
        if (numPages-- > 0) {
          fetchData();
        } else {
          finish();
        }
      }

      function fetchData() {
        if (next === null) {
          FB.api(
            '/me',
            'GET', {
              "fields": "id,email,name,about,bio,posts{message}"
            },
            function(response) {
              parseData(response.posts);
            }
          );
        } else {
          Ember.$.getJSON(next, function(response) {
              //console.log("success");
              parseData(response);
            })
            .fail(function() {
              //console.log("error");
              numPages = 0;
              finish();
            })
            .always(function() {
              //console.log("complete");
            });
        }
      }

      FB.login(function(response) {
        if (response.authResponse) {
          _this.set('userAuth', JSON.stringify(response));
          console.log('Welcome!  Fetching your information.... ');
          FB.api('/me', function(response) {
            console.log('Good to see you, ' + response.name + '.');
            _this.set('userInfo', JSON.stringify(response));
            _this.set('fetching', true);
            fetchData();
          });
        } else {
          console.log('User cancelled login or did not fully authorize.');
        }
      }, {
        scope: 'user_about_me,user_posts'
      });
    }
  }
});
