import DS from 'ember-data';
import BaseModel from './base';

export default BaseModel.extend({
  text: DS.attr('string'),
  status: DS.attr('string')
});
