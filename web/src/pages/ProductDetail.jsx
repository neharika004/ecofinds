import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchListing } from '../api/listings';
import { addToCart } from '../api/cart';
import toast from 'react-hot-toast';
import Card from '../components/Card';

export default function ProductDetail(){
  const { id } = useParams();
  const nav = useNavigate();
  const [item,setItem] = useState(null);

  useEffect(()=> { fetchListing(id).then(setItem).catch(()=>{}); },[id]);

  if (!item) return <Card>Loading...</Card>;

  async function handleAdd() {
    try {
      await addToCart(item.id);
      toast.success('Added to cart');
    } catch (e) {
      toast.error('Add failed');
    }
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <button onClick={() => nav(-1)} className="text-sm mb-3">← Back</button>
      <div className="md:flex gap-6">
        <img src={item.image} alt="" className="w-full md:w-1/2 h-64 object-cover rounded" />
        <div className="flex-1">
          <h2 className="text-2xl font-semibold">{item.title}</h2>
          <div className="kicker mt-1">{item.category} • ₹{item.price}</div>
          <div className="mt-3">{item.description}</div>
          <div className="mt-4 flex gap-3">
            <button className="btn btn-primary" onClick={handleAdd}>Add to cart</button>
            <button onClick={() => navigator.share?.({ title: item.title })} className="btn btn-outline">Share</button>
          </div>
        </div>
      </div>
    </Card>
  );
}
