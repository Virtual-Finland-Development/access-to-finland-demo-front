import * as auth from './services/auth';
import * as consent from './services/consent';
import * as data from './services/data';
import * as user from './services/user';

const api = {
  auth,
  user,
  data,
  consent,
};

export default api;
