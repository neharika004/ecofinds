import PageShell from '../components/PageShell';
import React, { useEffect, useState } from 'react';
import { fetchListings } from '../api/listings';
import { Link } from 'react-router-dom';
import socket from '../api/socket';
import Card from '../components/Card';
import { motion, AnimatePresence } from 'framer-motion';

const categories = ['All','Clothing','Electronics','Home','Books','Sports'];

function ListingCard({ l }) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <Card className="flex gap-3 items-center">
        <img src={l.image} alt="" style={{width:140,height:95}} className="listing-img" />
        <div className="flex-1">
          <Link to={`/listings/${l.id}`} className="h4 block">{l.title}</Link>
          <div className="kicker mt-1">{l.category} • ₹{l.price}</div>
          <div className="mt-2 flex items-center gap-2">
            <span className="badge">{l.greenScore}% green</span>
            <span className="kicker">Posted {new Date(l.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default function Listings(){
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const q = {};
      if (search) q.search = search;
      if (category && category !== 'All') q.category = category;
      const data = await fetchListings(q);
      setListings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{ load(); }, [search, category]);

  useEffect(()=> {
    // only add created listing if it matches current filters
    socket.on('listing:created', (d) => {
      const matchesSearch = !search || d.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'All' || d.category === category;
      if (matchesSearch && matchesCategory) setListings(prev => [d, ...prev]);
    });
    socket.on('listing:updated', (d) => setListings(prev => prev.map(p => p.id === d.id ? d : p)));
    socket.on('listing:deleted', ({ id }) => setListings(prev => prev.filter(p => p.id !== id)));
    return () => {
      socket.off('listing:created');
      socket.off('listing:updated');
      socket.off('listing:deleted');
    };
  },[search, category]); // note: include filters to make socket handler use latest values

  return (
    <PageShell title="Browse Listings" subtitle="Discover sustainable second-hand finds">
      <div className="search-row">
        <input className="input" placeholder="Search title..." value={search} onChange={e=>setSearch(e.target.value)} />
        <select className="input w-44" value={category} onChange={e=>setCategory(e.target.value)}>
          {categories.map(c=> <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        {loading ? (
          <div className="space-y-3">
            {[1,2,3,4].map(i => <div key={i} className="card animate-pulse" style={{height:96}} />)}
          </div>
        ) : (
          <>
            {listings.length === 0 ? (
              <Card>No listings yet. <Link to="/add" className="text-green-600">Add the first item</Link></Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                  {listings.map(l => <ListingCard key={l.id} l={l} />)}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </div>
    </PageShell>
  );
}
