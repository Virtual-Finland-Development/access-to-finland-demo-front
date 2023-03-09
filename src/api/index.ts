import * as auth from './services/auth';
import * as codesets from './services/codesets';
import * as consent from './services/consent';
import * as data from './services/data';
import * as user from './services/user';

const api = {
  auth,
  user,
  data,
  consent,
  codesets,
};

export default api;
