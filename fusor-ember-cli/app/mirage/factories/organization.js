/*
  This is an example factory definition.

  Create more files in this directory to define additional factories.
*/
import Mirage from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  name(i) {
    return 'org ' + i;
  },
  title(i) {
    return 'org ' + i;
  },
  label(i) {
    return 'org_' + i;
  },
  created_at: "2016-05-19",
  updated_at: "2016-05-19",
  description: null

});
