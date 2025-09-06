import API from './client';
export const addToCart = (id) => API.post(`/cart/${id}`).then(r=>r.data);
export const getCart = () => API.get('/cart').then(r=>r.data);
export const removeFromCart = (id) => API.delete(`/cart/${id}`).then(r=>r.data);
export const checkout = () => API.post('/checkout').then(r=>r.data);
export const getPurchases = () => API.get('/purchases').then(r=>r.data);
