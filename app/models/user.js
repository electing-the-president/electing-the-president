import DS from 'ember-data';
import BaseModel from './base';

export default BaseModel.extend({
  email: DS.attr('string'),
  username: DS.attr('string'),
  gravatarUrl: DS.attr('string'),
  model: DS.attr('number'),
  owner: DS.belongsTo('user', {inverse: null}),
  createdBy: DS.belongsTo('user', {inverse: null})
});
