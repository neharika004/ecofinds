import React, { useState } from 'react';
import { createListing } from '../api/listings';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import toast from 'react-hot-toast';

const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

export default function AddListing(){
  const [title,setTitle]=useState('');
  const [description,setDescription]=useState('');
  const [category,setCategory]=useState('Clothing');
  const [price,setPrice]=useState('');
  const [imageFile,setImageFile]=useState(null);
  const [error,setError]=useState('');
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    setError('');
    if (title.trim().length < 3) return setError('Title too short (min 3 chars)');
    if (!price || Number(price) <= 0) return setError('Enter a valid price');

    try {
      let imageData = undefined;
      if (imageFile) imageData = await toBase64(imageFile);
      const payload = { title, description, category, price: Number(price), image: imageData };
      await createListing(payload);
      toast.success('Listing created');
      nav('/listings');
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed');
      toast.error('Failed to create listing');
    }
  }

  return (
    <Card className="max-w-lg mx-auto">
      <h2 className="page-title">Add New Product</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
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
        <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />
        <div className="flex gap-3">
          <button className="btn btn-primary">Submit Listing</button>
          <button type="button" onClick={()=>{ setTitle(''); setDescription(''); setPrice(''); setImageFile(null); }} className="btn btn-outline">Reset</button>
        </div>
      </form>
    </Card>
  );
}
