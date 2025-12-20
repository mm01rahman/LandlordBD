import { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import Layout from '../components/Layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input, Label, Textarea } from '../components/ui/form';
import { formatMonth, money } from '../utils/formatters';

const Tenants = () => {
  const [tenants, setTenants] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    whatsapp : '',
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
    .then((res) => setTenants(res.data?.data ?? []))
    .catch((err) => {
      console.error(err?.response?.status, err?.response?.data);
      setError('Unable to load tenants. Please try again.');
    })
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
      setForm({ name: '', phone: '', whatsapp : '', email: '', address: '' });
      setSuccess('Tenant saved successfully.');
      await load();
    } catch {
      setError('Could not save tenant. Please retry.');
    } finally {
      setSavingTenant(false);
    }
  };

  const viewTenant = (id) => {
    // toggle behavior
    if (selectedId === id) {
      setSelectedId(null);
      setSelected(null);
      return;
    }

    setSelectedId(id);
    setLoadingSelection(true);
    setError('');
    api
      .get(`/tenants/${id}`)
      .then((res) => setSelected(res.data))
      .catch(() => {
        setError('Unable to load tenant details.');
        setSelectedId(null);
        setSelected(null);
      })
      .finally(() => setLoadingSelection(false));
  };

  return (
    <Layout>
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-semibold text-white">Tenants</h2>
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
              <Label>Whatsapp</Label>
              <Input
                name="whatsapp"
                value={form.whatsapp}
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
                  <tr
                    key={t.id}
                    onClick={() => viewTenant(t.id)}
                    className={`cursor-pointer transition ${
                      selectedId === t.id ? 'bg-slate-800' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="relative pl-4">
                      {selectedId === t.id && (
                        <span className="absolute left-0 top-0 h-full w-1 bg-emerald-500" />
                      )}
                      {t.name}
                    </td>
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
            {loadingSelection && (
              <p className="text-sm text-slate-400 animate-pulse">Loading agreements…</p>
            )}

            {(selected.agreements || []).length === 0 && !loadingSelection && (
              <p className="text-sm text-slate-500">No agreements found.</p>
            )}

            <div className="space-y-3">
              {(selected.agreements || []).map((a) => (
                <div
                  key={a.id}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 transition hover:bg-white/10"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-white">
                      Unit {a.unit?.unit_number ?? '—'}
                    </p>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold
                        ${
                          a.status === 'active'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : a.status === 'upcoming'
                            ? 'bg-blue-500/15 text-blue-400'
                            : 'bg-slate-500/15 text-slate-300'
                        }`}
                    >
                      {a.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-300">
                    <span>💰 {money(a.monthly_rent)}</span>
                    {a.start_date && <span>📅 Start: {formatMonth(a.start_date)}</span>}
                    {a.end_date_actual && (
                      <span>🏁 Ended: {formatMonth(a.end_date_actual)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
                {(selected?.payments?.data ?? []).map((p) => (
                  <tr key={p.id}>
                    <td>{formatMonth(p.billing_month)}</td>
                    <td>{money(p.amount_due)}</td>
                    <td>{money(p.amount_paid)}</td>
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
