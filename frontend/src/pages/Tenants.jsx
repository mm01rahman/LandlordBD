import { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import Layout from '../components/Layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input, Label, Textarea } from '../components/ui/form';

const Tenants = () => {
  const [tenants, setTenants] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [savingTenant, setSavingTenant] = useState(false);
  const [loadingTenants, setLoadingTenants] = useState(false);
  const [loadingSelection, setLoadingSelection] = useState(false);

  const load = () => {
    setLoadingTenants(true);
    setError('');
    return api
      .get('/tenants')
      .then((res) => setTenants(res.data))
      .catch(() => setError('Unable to load tenants. Please try again.'))
      .finally(() => setLoadingTenants(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (savingTenant) return;

    setError('');
    setSuccess('');

    if (!form.name.trim() || !form.phone.trim()) {
      setError('Name and phone are required.');
      return;
    }

    setSavingTenant(true);
    try {
      await api.post('/tenants', form);
      setForm({ name: '', phone: '', email: '', address: '' });
      setSuccess('Tenant saved successfully.');
      await load();
    } catch {
      setError('Could not save tenant. Please retry.');
    } finally {
      setSavingTenant(false);
    }
  };

  const viewTenant = (id) => {
    setLoadingSelection(true);
    setError('');
    api
      .get(`/tenants/${id}`)
      .then((res) => setSelected(res.data))
      .catch(() => setError('Unable to load tenant details.'))
      .finally(() => setLoadingSelection(false));
  };

  return (
    <Layout>
      <div className="flex flex-col gap-1">
        <p className="text-[12px] uppercase tracking-[0.2em] text-slate-400">
          People
        </p>
        <h2 className="text-3xl font-semibold text-white">Tenants</h2>
        <p className="text-sm text-slate-400">
          Directory with contact, agreements, and payments.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Add Tenant" className="lg:col-span-1">
          {error && <p className="text-sm text-rose-400">{error}</p>}
          {success && <p className="text-sm text-emerald-300">{success}</p>}

          <form className="space-y-3" onSubmit={handleSubmit}>
            <div>
              <Label>Name</Label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Phone</Label>
              <Input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Address</Label>
              <Textarea
                name="address"
                value={form.address}
                onChange={handleChange}
              />
            </div>

            <Button className="w-full" disabled={savingTenant}>
              {savingTenant ? 'Saving…' : 'Save tenant'}
            </Button>
          </form>
        </Card>

        <Card title="Tenant directory" className="lg:col-span-2">
          <table className="table-modern">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Agreements</th>
              </tr>
            </thead>
            <tbody>
              {loadingTenants ? (
                <tr>
                  <td colSpan="3" className="text-center">
                    Loading tenants...
                  </td>
                </tr>
              ) : tenants.length ? (
                tenants.map((t) => (
                  <tr key={t.id} onClick={() => viewTenant(t.id)}>
                    <td>{t.name}</td>
                    <td>{t.phone}</td>
                    <td>{t.agreements_count}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">
                    No tenants yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>

      {selected && (
        <div className="grid gap-4 lg:grid-cols-2 mt-4">
          <Card title="Agreements">
            {loadingSelection && <p>Loading...</p>}
            {(selected.agreements || []).map((a) => (
              <div key={a.id}>
                <p>{a.unit?.unit_number}</p>
                <p className="text-xs">
                  {a.status} • ${a.monthly_rent}
                </p>
              </div>
            ))}
          </Card>

          <Card title="Payments">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Due</th>
                  <th>Paid</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(selected.payments || []).map((p) => (
                  <tr key={p.id}>
                    <td>{p.billing_month}</td>
                    <td>${p.amount_due}</td>
                    <td>${p.amount_paid}</td>
                    <td>{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}
    </Layout>
  );
};

export default Tenants;
