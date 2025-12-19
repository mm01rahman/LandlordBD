import { useEffect, useState } from 'react';
import Layout from '../components/Layout';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

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
    </Layout>
  );
};

export default Profile;
