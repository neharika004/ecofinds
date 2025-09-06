import React, { useEffect, useState } from 'react';
import { fetchListings } from '../api/listings';
import { Link } from 'react-router-dom';
import socket from '../api/socket';

const categories = ['All','Clothing','Electronics','Home','Books','Sports'];

export default function Listings(){
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const q = {};
    if (search) q.search = search;
    if (category && category !== 'All') q.category = category;
    const data = await fetchListings(q);
    setListings(data);
    setLoading(false);
  }

  useEffect(()=>{ load(); }, [search, category]);

  useEffect(()=> {
    socket.on('listing:created', (d) => setListings(prev => [d, ...prev]));
    socket.on('listing:updated', (d) => setListings(prev => prev.map(p => p.id === d.id ? d : p)));
    socket.on('listing:deleted', ({ id }) => setListings(prev => prev.filter(p => p.id !== id)));
    return () => {
      socket.off('listing:created');
      socket.off('listing:updated');
      socket.off('listing:deleted');
    };
  },[]);

  return (
    <div>
      <div className="flex gap-3 mb-4">
        <input className="input" placeholder="Search title..." value={search} onChange={e=>setSearch(e.target.value)} />
        <select className="input w-40" value={category} onChange={e=>setCategory(e.target.value)}>
          {categories.map(c=> <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading ? <div>Loading...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listings.map(l => (
            <div key={l.id} className="card flex gap-3 items-center">
              <img src={l.image} alt="" style={{width:120,height:80,objectFit:'cover'}} className="rounded" />
              <div className="flex-1">
                <Link to={`/listings/${l.id}`} className="font-semibold">{l.title}</Link>
                <div className="text-sm text-gray-500">{l.category} • ₹{l.price}</div>
              </div>
              <div className="text-sm text-green-600 font-medium">{l.greenScore}%</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
