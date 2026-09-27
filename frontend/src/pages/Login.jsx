import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const DEMO_ACCOUNTS = [
  { label: 'Admin', email: 'admin@swachhsetu.com', password: 'admin123', badge: 'Admin', color: 'bg-emerald-100 text-emerald-700' },
  { label: 'Resident', email: 'user@swachhsetu.com', password: 'user123', badge: 'User', color: 'bg-blue-100 text-blue-700' },
];

export default function Login() {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const fillDemo = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setErrors({});
  };

  const validate = () => {
    const e = {};
    if (!email) e.email = 'Email is required';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const userData = await login(email, password);
      addToast(`Welcome back, ${userData.name.split(' ')[0]}!`, 'success');
      navigate(userData.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      addToast(err.response?.data?.error || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-600 rounded-2xl mb-4">
            <Leaf size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 ">Welcome to swachhsetu</h1>
          <p className="text-gray-500  text-sm mt-1">Sign in to manage your waste pickups</p>
        </div>

        {/* Demo quick-login */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
          <p className="text-xs font-semibold text-amber-700 mb-2">⚡ Demo Quick Login</p>
          <div className="flex gap-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.label}
                onClick={() => fillDemo(acc)}
                className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-colors hover:opacity-80 ${acc.color} border-transparent`}
              >
                {acc.label} Account
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white   rounded-2xl border border-gray-100 shadow-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors({}); }}
              error={errors.email}
              placeholder="you@example.com"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors({}); }}
              error={errors.password}
              placeholder="••••••••"
              required
            />
            <Button type="submit" loading={loading} className="w-full" size="lg">
              Sign In
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500  mt-4">
          New here?{' '}
          <Link to="/my-requests" className="text-emerald-600 font-medium hover:underline">
            Track a request without login
          </Link>
        </p>
      </div>
    </div>
  );
}
