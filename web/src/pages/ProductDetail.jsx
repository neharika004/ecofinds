import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchListing } from '../api/listings';
import { addToCart } from '../api/cart';

export default function ProductDetail(){
  const { id } = useParams();
  const [item,setItem] = useState(null);

  useEffect(()=> {
    fetchListing(id).then(setItem);
  },[id]);

  if (!item) return <div>Loading...</div>;

  async function handleAdd() {
    await addToCart(item.id);
    alert('Added to cart');
  }

  return (
    <div className="max-w-2xl mx-auto card">
      <button onClick={()=>history.back()} className="text-sm mb-3">← Back</button>
      <img src={item.image} alt="" className="w-full h-60 object-cover rounded mb-4" />
      <h2 className="text-2xl font-semibold">{item.title}</h2>
      <div className="text-sm text-gray-500">{item.category} • ₹{item.price}</div>
      <div className="mt-3">{item.description}</div>
      <div className="mt-4 flex gap-2">
        <button className="btn btn-primary" onClick={handleAdd}>Add to cart</button>
      </div>
    </div>
  );
}
