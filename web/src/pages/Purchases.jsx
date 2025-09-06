import React, { useEffect, useState } from 'react';
import { getPurchases } from '../api/cart';

export default function Purchases(){
  const [items,setItems] = useState([]);
  useEffect(()=>{ getPurchases().then(setItems); },[]);
  return (
    <div>
      <h2 className="text-xl mb-4">Previous Purchases</h2>
      <div className="space-y-3">
        {items.length === 0 && <div className="card">No purchases yet</div>}
        {items.map(p => (
          <div key={p.id} className="card flex justify-between items-center">
            <div>
              <div className="font-semibold">{p.listing.title}</div>
              <div className="text-sm text-gray-500">₹{p.listing.price}</div>
            </div>
            <div className="text-sm text-gray-500">{new Date(p.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
