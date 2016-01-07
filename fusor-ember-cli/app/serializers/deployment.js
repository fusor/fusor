import DS from 'ember-data';

export default DS.ActiveModelSerializer.extend({
  isNewSerializerAPI: true,

  attrs: {
    foreman_task_id: false
  }

});
