import API from './client';
export const fetchListings = (q={}) => API.get('/listings', { params: q }).then(r => r.data);
export const createListing = (payload) => API.post('/listings', payload).then(r=>r.data);
export const updateListing = (id, payload) => API.put(`/listings/${id}`, payload).then(r=>r.data);
export const deleteListing = (id) => API.delete(`/listings/${id}`).then(r=>r.data);
export const fetchListing = (id) => API.get(`/listings/${id}`).then(r=>r.data);
