import React, { useEffect, useState } from 'react';
import { getCart, removeFromCart, checkout } from '../api/cart';
import { useNavigate } from 'react-router-dom';

export default function CartPage(){
  const [items, setItems] = useState([]);
  const nav = useNavigate();

  async function load(){ const data = await getCart(); setItems(data); }
  useEffect(()=>{ load(); }, []);

  async function handleRemove(listingId) { await removeFromCart(listingId); load(); }
  async function handleCheckout(){ await checkout(); alert('Checked out'); nav('/purchases'); }

  if (!items.length) return <div className="card">Cart is empty</div>;

  return (
    <div>
      <h2 className="text-xl mb-4">Cart</h2>
      <div className="space-y-3">
        {items.map(i=>(
          <div key={i.id} className="card flex justify-between items-center">
            <div>
              <div className="font-semibold">{i.listing.title}</div>
              <div className="text-sm text-gray-500">₹{i.listing.price}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>handleRemove(i.listingId)} className="btn text-red-500">Remove</button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <button className="btn btn-primary" onClick={handleCheckout}>Checkout</button>
      </div>
    </div>
  );
}
