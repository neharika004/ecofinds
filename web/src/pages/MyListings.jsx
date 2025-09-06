import React, { useEffect, useState } from 'react';
import { fetchListings, deleteListing } from '../api/listings';
import { Link } from 'react-router-dom';
import { me } from '../api/auth';

export default function MyListings() {
  const [items, setItems] = useState([]);
  const [meData, setMeData] = useState(null);

  async function load() {
    try {
      const all = await fetchListings();
      const m = await me();
      setMeData(m);
      // show only listings owned by logged-in user
      setItems(all.filter(x => x.userId === m.id));
    } catch (err) {
      console.error('Failed to load my listings', err);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id) {
    if (!confirm('Delete listing?')) return;
    try {
      await deleteListing(id);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      alert('Could not delete (maybe not your listing)');
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl">My Listings</h2>
        <Link to="/add" className="btn btn-primary">+ Add</Link>
      </div>
      <div className="space-y-3">
        {items.length === 0 && <div className="card">No listings yet</div>}
        {items.map(i => (
          <div key={i.id} className="card flex items-center justify-between">
            <div>
              <div className="font-semibold">{i.title}</div>
              <div className="text-sm text-gray-500">₹{i.price} • {i.category}</div>
            </div>
            <div className="flex gap-2">
              <Link to={`/listings/${i.id}`} className="btn">View</Link>
              <button
                onClick={() => handleDelete(i.id)}
                className="btn text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
