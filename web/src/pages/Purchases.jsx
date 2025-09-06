import React, { useEffect, useState } from 'react';
import { getPurchases } from '../api/cart';
import Card from '../components/Card';

export default function Purchases(){
  const [items,setItems] = useState([]);
  useEffect(()=>{ getPurchases().then(setItems); },[]);
  return (
    <div>
      <h2 className="page-title">Previous Purchases</h2>
      <div className="space-y-3">
        {items.length === 0 && <Card>No purchases yet</Card>}
        {items.map(p => (
          <Card key={p.id} className="flex justify-between items-center">
            <div>
              <div className="font-semibold">{p.listing.title}</div>
              <div className="kicker">₹{p.listing.price}</div>
            </div>
            <div className="kicker">{new Date(p.createdAt).toLocaleString()}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
