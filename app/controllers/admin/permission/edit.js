import Ember from 'ember';

export default Ember.Controller.extend({
  modelOptions: [{id: 0, label:'Loading...'}],
  roleOptions: [{id: 0, label:'Loading...'}],
  relationOptions:[
    {relation:'role'},
    {relation:'owner'}
  ],
  actionOptions:[
    {action:'create'},
    {action:'read'},
    {action:'update'},
    {action:'delete'}
  ]
});
