import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input, Label } from '../components/ui/form';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, actionState } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(
        actionState.error && actionState.type === 'login'
          ? actionState.error
          : 'Invalid credentials. Please check your email and password.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink text-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg space-y-6">
        <Link
  to="/"
  className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
>
  ← Back to Home
</Link>
        <div className="text-center space-y-2">
          <p className="text-[12px] uppercase tracking-[0.22em] text-slate-400">Smart Rental</p>
          <h1 className="text-3xl font-semibold text-white">Sign in to your console</h1>
        </div>

        <Card className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-white">Welcome back</h2>
            <p className="text-sm text-slate-400">Use the email and password you registered with.</p>
          </div>

          {error && <p className="text-sm text-rose-400" role="alert">{error}</p>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
              <p className="text-[12px] text-slate-500">We&apos;ll never share your email.</p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <p className="text-[12px] text-slate-500">At least 8 characters recommended.</p>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={submitting}>
              {submitting ? 'Signing in…' : '🔐 Sign in'}
            </Button>
          </form>

          <p className="text-sm text-slate-400 text-center">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-primary-200 hover:text-white font-semibold">
              Create one now
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Login;
