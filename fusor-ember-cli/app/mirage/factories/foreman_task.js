/*
  This is an example factory definition.

  Create more files in this directory to define additional factories.
*/
import Mirage/*, {faker} */ from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  id(i) {
    return 'foreman_uuid_9a2b47f2-4006__' + i;
  },
  label: 'Actions::Katello::ContentView::CapsuleGenerateAndSync',
  pending: false,
  username: 'admin',
  started_at: "2016-05-15T12:33:19.000+03:00",
  ended_at: "2016-05-15T12:33:19.000+03:00",
  progress: '0.7',
  state: 'pending',
  result: 'success',
  external_id: "227f45c4-3faa-4ed7-a0ee-72e3af9f168e",
  repository: null
});
