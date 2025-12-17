import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import Layout from '../components/Layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input, Label, Select } from '../components/ui/form';
import { extractArray } from '../utils/normalize';

const Buildings = () => {
  const [buildings, setBuildings] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [form, setForm] = useState({ name: '', address: '', city: '', state: '', zip_code: '', total_floors: '' });

  const load = () => api.get('/buildings').then((res) => setBuildings(extractArray(res)));

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/buildings', form);
    setForm({ name: '', address: '', city: '', state: '', zip_code: '', total_floors: '' });
    load();
  };

  const handleDelete = async (id) => {
    await api.delete(`/buildings/${id}`);
    load();
  };

  const handleUpdate = async (building) => {
    const name = prompt('Building name', building.name);
    if (!name) return;
    await api.put(`/buildings/${building.id}`, { ...building, name });
    load();
  };

  const filteredBuildings = useMemo(() => {
    const items = buildings.filter((b) => b.name.toLowerCase().includes(search.toLowerCase()));
    if (sort === 'units') {
      return [...items].sort((a, b) => (b.units_count || 0) - (a.units_count || 0));
    }
    return [...items].sort((a, b) => a.name.localeCompare(b.name));
  }, [buildings, search, sort]);

  return (
    <Layout>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[12px] uppercase tracking-[0.2em] text-slate-400">Portfolio</p>
          <h2 className="text-3xl font-semibold text-white leading-tight">Buildings</h2>
          <p className="text-sm text-slate-400">Readable overview of addresses, floors, and units.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="ghost" size="sm">🔄 Sync PMS</Button>
          <Button variant="outline" size="sm">📤 Export CSV</Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Add Building" description="Clear labels with helper text" className="lg:col-span-1">
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <Label>Name</Label>
              <Input placeholder="Lunar Heights" name="name" value={form.name} onChange={handleChange} required />
              <p className="text-[12px] text-slate-500">Visible to staff and tenants.</p>
            </div>
            <div className="space-y-1">
              <Label>Address</Label>
              <Input placeholder="123 Orbit Ave" name="address" value={form.address} onChange={handleChange} required />
              <p className="text-[12px] text-slate-500">Street address for mail and agreements.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>City</Label>
                <Input name="city" value={form.city} onChange={handleChange} placeholder="City" />
              </div>
              <div className="space-y-1">
                <Label>State</Label>
                <Input name="state" value={form.state} onChange={handleChange} placeholder="State" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Zip</Label>
                <Input name="zip_code" value={form.zip_code} onChange={handleChange} placeholder="0000" />
              </div>
              <div className="space-y-1">
                <Label>Floors</Label>
                <Input name="total_floors" value={form.total_floors} onChange={handleChange} placeholder="12" />
              </div>
            </div>
            <Button type="submit" className="w-full">
              🏢 Save building
            </Button>
          </form>
        </Card>

        <Card
          title="Portfolio Overview"
          description="Search, sort, and manage"
          className="lg:col-span-2"
          actions={
            <div className="flex gap-2">
              <Input
                placeholder="Search by name"
                className="w-48"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Select className="w-36" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="name">Sort: Name</option>
                <option value="units">Sort: Units</option>
              </Select>
            </div>
          }
        >
          <div className="table-shell overflow-x-auto">
            <table className="table-modern min-w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Units</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBuildings.map((b) => (
                  <tr key={b.id}>
                    <td className="font-semibold text-white">{b.name}</td>
                    <td className="text-slate-300">{b.address}</td>
                    <td>
                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                        {b.units_count || 0} units
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-2 text-sm">
                        <Link className="text-primary-200 hover:text-white" to={`/buildings/${b.id}/units`}>
                          View Units
                        </Link>
                        <button className="text-accent-500 hover:text-white" onClick={() => handleUpdate(b)}>
                          Edit
                        </button>
                        <button className="text-rose-400 hover:text-white" onClick={() => handleDelete(b.id)}>
                          Delete
                        </button>
                      </div>
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

export default Buildings;
