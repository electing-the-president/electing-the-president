import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    gender: DS.attr('string'),
    party: DS.attr('string'),
    birthdate: DS.attr('date'),
    birthplace: DS.attr('string'),
    hometown: DS.attr('string'),
    religion: DS.attr('string'),
    education: DS.attr('string'),
    political: DS.attr('string'),
    professional: DS.attr('string')
});
