import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/auth';
import Card from '../components/Card';
import toast from 'react-hot-toast';

export default function Login() {
  const [email,setEmail]=useState('demo@ecofinds.app');
  const [password,setPassword]=useState('password');
  const [err,setErr]=useState('');
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    try {
      const res = await login({ email, password });
      localStorage.setItem('ecofinds_token', res.token);
      toast.success('Logged in');
      nav('/listings');
    } catch (e) {
      setErr(e?.response?.data?.error || 'Login failed');
      toast.error('Login failed');
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <h2 className="page-title">Welcome back</h2>
      {err && <div className="text-red-500 mb-2">{err}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
        <input className="input" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" />
        <button className="btn btn-primary w-full">Login</button>
      </form>
      <div className="mt-3 text-sm">Don't have account? <Link to="/signup" className="text-green-600">Sign up</Link></div>
    </Card>
  );
}
