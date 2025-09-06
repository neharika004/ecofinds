import PageShell from '../components/PageShell';
import { me } from '../api/auth';
import API from '../api/client';
import toast from 'react-hot-toast';
import React, { useEffect, useState } from 'react';

export default function Dashboard(){
  const [user,setUser] = useState(null);
  const [username,setUsername] = useState('');

  useEffect(()=>{ me().then(u => { setUser(u); setUsername(u.username); }); },[]);

  async function save() {
    try {
      await API.put('/me', { username, email: user.email });
      toast.success('Saved changes');
    } catch {
      toast.error('Update failed');
    }
  }

  if (!user) return <PageShell title="Profile"><div>Loading...</div></PageShell>;

  return (
    <PageShell title="Profile" subtitle="Manage your account details">
      <div className="space-y-4">
        <div>
          <label className="kicker block">Email</label>
          <div className="font-medium">{user.email}</div>
        </div>
        <div>
          <label className="kicker block mb-1">Username</label>
          <input className="input" value={username} onChange={e=>setUsername(e.target.value)} />
        </div>
        <button className="btn btn-primary mt-3" onClick={save}>Save</button>
      </div>
    </PageShell>
  );
}
