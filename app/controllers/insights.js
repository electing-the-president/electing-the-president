import Ember from 'ember';
import ENV from 'electing-the-president/config/environment';

export default Ember.Controller.extend({
  userAuth: null,
  userInfo: null,
  userData: null,
  progress: 90,
  graphData: function() {
    var data = [];
    var raw = this.get('userInsights.tree.children');
    var i = -1;
    while (raw[++i].name !== 'Big 5') {}
    console.log(raw[i]);
    raw = raw[i].children[0].children;
    for (var q = 0; q < raw.length; ++q) {
      console.log(raw[q]);
      console.log(raw[q].id);
      if (raw[q].id === "Conscientiousness_parent") {
        data.push({
          axis: "Open",
          value: raw[q].percentage * 5
        });
      } else if (raw[q].id === "Conscientiousness") {
        data.push({
          axis: "Conscientious",
          value: raw[q].percentage * 5
        });
      } else if (raw[q].id === "Extraversion") {
        data.push({
          axis: "Extraverted",
          value: raw[q].percentage * 5
        });
      } else if (raw[q].id === "Agreeableness") {
        data.push({
          axis: "Agreeable",
          value: raw[q].percentage * 5
        });
      } else if (raw[q].id === "Neuroticism") {
        data.push({
          axis: "Neurotic",
          value: raw[q].percentage * 5
        });
      }
    }
    console.log(data);
    return data;
  }.property('userInsights'),
  formattedInsights: function() {
    console.log('grt');
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
  numPagesToFetch: 100,
  getInsights: function() {
    var _this = this;
    var request = {
      type: 'fb',
      typeId: this.get('userInfo.id'),
      rawInputText: this.get('userData')
    };
    Ember.$.ajax({
      dataType: "json",
      url: ENV.apiEndPoint + '/insights/analyze',
      data: request,
      success: function(response) {
        _this.set('userInsights', response);
      }
    });
  },
  actions: {
    getUserStatuses: function() {
      var _this = this;
      var next = null;
      var totalPages = this.get('numPagesToFetch');
      var numPages = totalPages;
      var dataCollection = [];

      function finish() {
        console.log('All done!');
        _this.set('userData', dataCollection.join(' '));
        _this.set('fetching', false);
        _this.getInsights();
      }

      function parseData(posts) {
        _this.set('progress', (totalPages - numPages) / totalPages * 100);
        if (posts && posts.paging && posts.paging.next) {
          next = posts.paging.next;
        } else {
          numPages = 0;
        }
        if (posts && posts.data) {
          for (let post of posts.data) {
            //console.log(post);
            if (post.message) {
              dataCollection.push(post.message);
            }
          }
        }
        if (numPages-- > 0) {
          setTimeout(fetchData, 250);
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
              console.log("success");
              parseData(response);
            })
            .fail(function() {
              console.log("error");
              numPages = 0;
              finish();
            })
            .always(function() {
              console.log("complete");
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
