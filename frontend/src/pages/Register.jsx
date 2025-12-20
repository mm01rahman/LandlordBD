import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input, Label } from '../components/ui/form';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register, actionState } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setError('');
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setError('All fields are required.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setSubmitting(true);
    try {
      await register({ name, email, phone, password });
      navigate('/');
    } catch (err) {
      setError(
        actionState.error && actionState.type === 'register'
          ? actionState.error
          : 'Unable to sign up. Please check your details and try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink text-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl space-y-6">
        <Link
  to="/"
  className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
>
  ← Back to Home
</Link>

        <div className="text-center space-y-2">
          <p className="text-[12px] uppercase tracking-[0.22em] text-slate-400">Smart Rental</p>
          <h1 className="text-3xl font-semibold text-white">Create an account</h1>
        </div>

        <Card className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-white">Get started</h2>
            <p className="text-sm text-slate-400">We use your details to keep payments and agreements organized.</p>
          </div>

          {error && <p className="text-sm text-rose-400" role="alert">{error}</p>}

          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <div className="space-y-1 md:col-span-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Mercer"
                required
              />
              <p className="text-[12px] text-slate-500">Use your legal name for agreements.</p>
            </div>

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
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 010-2222"
                required
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <p className="text-[12px] text-slate-500">At least 8 characters; avoid reusing old passwords.</p>
            </div>

            <div className="md:col-span-2 space-y-3">
              <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                {submitting ? 'Creating account…' : '🚀 Create account'}
              </Button>
              <p className="text-sm text-slate-400 text-center">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-200 hover:text-white font-semibold">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
