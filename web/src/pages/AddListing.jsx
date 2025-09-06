import React, { useState } from 'react';
import { createListing } from '../api/listings';
import { useNavigate } from 'react-router-dom';

export default function AddListing(){
  const [title,setTitle]=useState('');
  const [description,setDescription]=useState('');
  const [category,setCategory]=useState('Clothing');
  const [price,setPrice]=useState('');
  const [error,setError]=useState('');
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    try {
      const payload = { title, description, category, price: Number(price) };
      await createListing(payload);
      nav('/listings');
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed');
    }
  }

  return (
    <div className="max-w-lg mx-auto card">
      <h2 className="text-xl mb-4">Add New Product</h2>
      {error && <div className="text-red-500">{error}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input className="input" placeholder="Product Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <select className="input" value={category} onChange={e=>setCategory(e.target.value)}>
          <option>Clothing</option>
          <option>Electronics</option>
          <option>Home</option>
          <option>Books</option>
          <option>Sports</option>
        </select>
        <textarea className="input" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} rows={4} />
        <input className="input" placeholder="Price (INR)" value={price} onChange={e=>setPrice(e.target.value)} type="number" />
        <div className="flex gap-2">
          <button className="btn btn-primary">Submit Listing</button>
          <button type="button" onClick={()=>{ setTitle(''); setDescription(''); setPrice(''); }} className="btn">Reset</button>
        </div>
      </form>
    </div>
  );
}
