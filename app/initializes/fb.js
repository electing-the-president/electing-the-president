import FB from 'ember-cli-facebook-js-sdk/fb';

export default {
  name: 'fb',
  initialize: function() {
    return FB.init({
      appId: '1499867060310161',
      version: 'v2.5',
      xfbml: true
    });
  }
};
