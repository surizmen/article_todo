import Http from '../Http';
import * as action from '../store/actions';

export function login(credentials) {
  return (dispatch) => new Promise((resolve, reject) => {
    Http.post('/api/v1/auth/login', credentials)
      .then((res) => {
        dispatch(action.authLogin(res.data));
        return resolve();
      })
      .catch((err) => {
        const { status, errors } = err.response.data;
        const data = {
          status,
          errors,
        };
        return reject(data);
      });
  });
}

export function register(credentials) {
  return (dispatch) => new Promise((resolve, reject) => {
    Http.post('/api/v1/auth/register', credentials)
      .then((res) => resolve(res.data))
      .catch((err) => {
        const { status, errors } = err.response.data;
        const data = {
          status,
          errors,
        };
        return reject(data);
      });
  });
}

