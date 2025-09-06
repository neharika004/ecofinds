import API from './client';

export const signup = (data) => API.post('/signup', data).then(r => r.data);
export const login = (data) => API.post('/login', data).then(r => r.data);
export const me = () => API.get('/me').then(r => r.data);
