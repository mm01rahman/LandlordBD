import { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import Layout from '../components/Layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input, Label, Select } from '../components/ui/form';
import { extractArray } from '../utils/normalize';
import { formatMonth, money } from '../utils/formatters';

const Agreements = () => {
  const [agreements, setAgreements] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [units, setUnits] = useState([]);
  const [createBuildingId, setCreateBuildingId] = useState('');
  const [filters, setFilters] = useState({ status: '', tenant_id: '', building_id: '' });
  const [form, setForm] = useState({ tenant_id: '', unit_id: '', start_date: '', end_date: '', monthly_rent: '', security_deposit: '' });

  const load = () => {
    api.get('/agreements', { params: filters }).then((res) => setAgreements(extractArray(res)));
  };

  useEffect(() => {
    api.get('/tenants').then((res) => setTenants(extractArray(res)));
    api.get('/buildings').then((res) => setBuildings(extractArray(res)));
  }, []);

  useEffect(() => {
    load();
  }, [filters]);

  const handleCreateBuildingChange = async (buildingId) => {
    setCreateBuildingId(buildingId);
    if (buildingId) {
      const res = await api.get(`/buildings/${buildingId}/units`);
      setUnits(extractArray(res)); // <-- consistent with other calls
    } else {
      setUnits([]);
    }
    setForm((prev) => ({ ...prev, unit_id: '' }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/agreements', form);
    setForm({ tenant_id: '', unit_id: '', start_date: '', end_date: '', monthly_rent: '', security_deposit: '' });
    load();
  };

  const endAgreement = async (id) => {
    await api.post(`/agreements/${id}/end`);
    load();
  };

  return (
    <Layout>
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-semibold text-white leading-tight">Rental Agreements</h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Create Agreement" className="lg:col-span-1">
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <Label>Tenant</Label>
              <Select
                name="tenant_id"
                value={form.tenant_id}
                onChange={(e) => setForm({ ...form, tenant_id: e.target.value })}
                required
              >
                <option value="">Select tenant</option>
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Building</Label>
              <Select value={createBuildingId} onChange={(e) => handleCreateBuildingChange(e.target.value)}>
                <option value="">Select building</option>
                {buildings.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Unit</Label>
              <Select
                name="unit_id"
                value={form.unit_id}
                onChange={(e) => setForm({ ...form, unit_id: e.target.value })}
                required
              >
                <option value="">Select unit</option>
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.unit_number}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Start date</Label>
                <Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} required />
              </div>
              <div className="space-y-1">
                <Label>End date</Label>
                <Input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Monthly rent</Label>
                <Input
                  placeholder="1200"
                  value={form.monthly_rent}
                  onChange={(e) => setForm({ ...form, monthly_rent: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Deposit</Label>
                <Input
                  placeholder="500"
                  value={form.security_deposit}
                  onChange={(e) => setForm({ ...form, security_deposit: e.target.value })}
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              📝 Save agreement
            </Button>
          </form>
        </Card>

        <Card
          title="Agreements Pipeline"
          description="Filter by status, tenant, or building"
          className="lg:col-span-2"
          actions={
            <div className="flex flex-wrap gap-2">
              <Select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="w-36">
                <option value="">All statuses</option>
                <option value="active">Active</option>
                <option value="ended">Ended</option>
                <option value="upcoming">Upcoming</option>
              </Select>
              <Select value={filters.tenant_id} onChange={(e) => setFilters({ ...filters, tenant_id: e.target.value })} className="w-40">
                <option value="">All tenants</option>
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </Select>
              <Select value={filters.building_id} onChange={(e) => setFilters({ ...filters, building_id: e.target.value })} className="w-40">
                <option value="">All buildings</option>
                {buildings.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </Select>
            </div>
          }
        >
          <div className="table-shell overflow-x-auto">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Tenant</th>
                  <th>Unit</th>
                  <th>Rent</th>
                  <th>Security Deposit</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {agreements.map((a) => (
                  <tr key={a.id}>
                    <td className="text-white">{a.tenant?.name ?? '—'}</td>

                    <td className="text-slate-300">
                      {a.unit ? `${a.unit.unit_number} • ${a.unit.building?.name ?? ''}` : '—'}
                    </td>

                    <td className="text-slate-300">{money(a.monthly_rent)}</td>

                    <td className="text-slate-300">{money(a.security_deposit)}</td>

                    <td className="text-slate-300">{formatMonth(a.start_date)}</td>

                    <td className="text-slate-300">
                      {a.end_date_actual ? formatMonth(a.end_date_actual) : (a.end_date ? formatMonth(a.end_date) : '—')}
                    </td>

                    <td className="text-slate-200">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold">
                        {a.status === 'active'
                          ? '✅ Active'
                          : a.status === 'upcoming'
                          ? '🗓️ Upcoming'
                          : '✔️ Ended'}
                      </span>
                    </td>

                    <td>
                      {a.status === 'active' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation(); // prevents any row click handlers in future
                            endAgreement(a.id);
                          }}
                        >
                          🏁 End
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Agreements;
