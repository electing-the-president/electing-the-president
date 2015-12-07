import DS from 'ember-data';
import BaseModel from './base';

export default BaseModel.extend({
  question: DS.attr('string'),
  count:  DS.attr('number')
});
