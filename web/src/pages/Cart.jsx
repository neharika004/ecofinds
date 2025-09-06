import React, { useEffect, useState } from 'react';
import { getCart, removeFromCart, checkout } from '../api/cart';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import toast from 'react-hot-toast';

export default function CartPage(){
  const [items, setItems] = useState([]);
  const nav = useNavigate();

  async function load(){ const data = await getCart(); setItems(data); }
  useEffect(()=>{ load(); }, []);

  async function handleRemove(listingId) { await removeFromCart(listingId); load(); toast.success('Removed'); }
  async function handleCheckout(){ await checkout(); toast.success('Checked out'); nav('/purchases'); }

  if (!items.length) return <Card>Your cart is empty</Card>;

  return (
    <div>
      <h2 className="page-title">Cart</h2>
      <div className="space-y-3">
        {items.map(i=>(
          <Card key={i.id} className="flex justify-between items-center">
            <div>
              <div className="font-semibold">{i.listing.title}</div>
              <div className="kicker">₹{i.listing.price}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>handleRemove(i.listingId)} className="btn btn-outline">Remove</button>
            </div>
          </Card>
        ))}
      </div>
      <div className="mt-4">
        <button className="btn btn-primary" onClick={handleCheckout}>Checkout</button>
      </div>
    </div>
  );
}
