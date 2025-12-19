import { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    api.get('/me').then((res) => {
      setUser(res.data);
      setForm({
        name: res.data.name,
        email: res.data.email,
        phone: res.data.phone || '',
      });
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await api.put('/profile', form);
    setUser(data);
  };

  return (
    <Layout>
      <div className="space-y-2 mb-4">
        <p className="text-[12px] uppercase tracking-[0.2em] text-slate-400">
          Account
        </p>
        <h2 className="text-2xl font-semibold text-white">
          Profile
        </h2>
        <p className="text-sm text-slate-400">
          Update your basic account information.
        </p>
      </div>

      {user && (
        <div className="max-w-xl rounded-2xl border border-white/10 bg-white/5 p-6 shadow-brand">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {['name', 'email', 'phone'].map((field) => (
              <div key={field} className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-200 capitalize">
                  {field}
                </label>

                <input
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-slate-100 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                  name={field}
                  value={form[field]}
                  onChange={(e) =>
                    setForm({ ...form, [field]: e.target.value })
                  }
                  required={field !== 'phone'}
                />

                <p className="text-[12px] text-slate-400">
                  {field === 'phone'
                    ? 'Optional contact number.'
                    : 'Used for account identification.'}
                </p>
              </div>
            ))}

            <div className="pt-2">
              <Button type="submit" className="w-full md:w-auto">
                Save profile
              </Button>
            </div>
          </form>
        </div>
      )}
    </Layout>
  );
};

export default Profile;
