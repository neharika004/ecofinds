import React, { useState } from 'react';
import { signup } from '../api/auth';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await signup({ email, password, username });
      localStorage.setItem('ecofinds_token', res.token);
      nav('/listings');
    } catch (e) {
      setErr(e?.response?.data?.error || 'Signup failed');
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 card">
      <h2 className="text-xl font-semibold mb-4">Sign up</h2>
      {err && <div className="text-red-500 mb-2">{err}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
        />
        <input
          className="input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
        />
        <button className="btn btn-primary w-full">Create account</button>
      </form>
    </div>
  );
}
