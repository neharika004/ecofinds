import React, { useEffect, useState } from 'react';
import { fetchListings, deleteListing } from '../api/listings';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import { me } from '../api/auth';
import toast from 'react-hot-toast';

export default function MyListings() {
  const [items, setItems] = useState([]);
  const [meData, setMeData] = useState(null);

  async function load() {
    try {
      const all = await fetchListings();
      const m = await me();
      setMeData(m);
      setItems(all.filter(x => x.userId === m.id));
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(()=>{ load(); }, []);

  async function handleDelete(id) {
    if (!confirm('Delete listing?')) return;
    try {
      await deleteListing(id);
      setItems(prev => prev.filter(i => i.id !== id));
      toast.success('Deleted');
    } catch (err) {
      toast.error('Could not delete (maybe not your listing)');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="page-title">My Listings</h2>
        <Link to="/add" className="btn btn-primary">+ Add</Link>
      </div>
      <div className="space-y-3">
        {items.length === 0 && <Card>No listings yet</Card>}
        {items.map(i => (
          <Card key={i.id} className="flex items-center justify-between">
            <div>
              <div className="font-semibold">{i.title}</div>
              <div className="kicker">₹{i.price} • {i.category}</div>
            </div>
            <div className="flex gap-2">
              <Link to={`/listings/${i.id}`} className="btn btn-outline">View</Link>
              <button onClick={()=>handleDelete(i.id)} className="btn text-red-500">Delete</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
