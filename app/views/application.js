import Ember from 'ember';

export default Ember.View.extend({
  hideNavbarMenu: function() {
    Ember.$(document).ready(function() {
      Ember.$("#mobileMenu").mmenu({
        extensions: ["theme-dark", "pagedim-black", "iconbar"],
        /*navbar: false,
        navbars: {
          height: 4,
          content: [
            '<a href="#/" class="fa fa-phone"></a>',
            '<img src="http://lorempixel.com/60/60/people/1/" />',
            '<a href="#/" class="fa fa-envelope"></a>'
          ]
        }*/
      }).on('click',
        'a[href^="#/"]',
        function() {
          alert("Thank you for clicking, but that's a demo link.");
          return false;
        }
      );
    });

  }.on('didInsertElement')
});
