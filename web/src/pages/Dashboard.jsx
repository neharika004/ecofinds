import React, { useEffect, useState } from 'react';
import { me } from '../api/auth';
import API from '../api/client';

export default function Dashboard(){
  const [user,setUser] = useState(null);
  const [username,setUsername] = useState('');

  useEffect(()=>{ me().then(u => { setUser(u); setUsername(u.username); }); },[]);

  async function save() {
    const res = await API.put('/me', { username, email: user.email });
    // server responds with sanitized user
    setUser(res.data || res);
    alert('Saved');
  }

  if (!user) return <div>Loading...</div>;
  return (
    <div className="max-w-md mx-auto card">
      <h2 className="text-xl mb-4">Your Profile</h2>
      <div className="mb-3">
        <label className="block text-sm">Email</label>
        <div>{user.email}</div>
      </div>
      <div className="mb-3">
        <label className="block text-sm">Username</label>
        <input className="input" value={username} onChange={e=>setUsername(e.target.value)} />
      </div>
      <button className="btn btn-primary" onClick={save}>Save</button>
    </div>
  );
}
