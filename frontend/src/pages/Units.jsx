import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axiosInstance';
import Layout from '../components/Layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input, Label, Select } from '../components/ui/form';

const StatusBadge = ({ status }) => (
  <span
    className={`rounded-full px-3 py-1 text-xs font-semibold ${
      status === 'occupied'
        ? 'bg-emerald-500/10 text-emerald-200 border border-emerald-500/30'
        : 'bg-amber-500/10 text-amber-200 border border-amber-500/30'
    }`}
  >
    {status}
  </span>
);

const Units = () => {
  const { buildingId } = useParams();
  const [building, setBuilding] = useState(null);
  const [units, setUnits] = useState([]);
  const [view, setView] = useState('table');
  const [form, setForm] = useState({ unit_number: '', floor: '', type: '', rent_amount: '', status: 'vacant' });

const load = async () => {
  const [bRes, uRes] = await Promise.all([
    api.get(`/buildings/${buildingId}`),
    api.get(`/buildings/${buildingId}/units`),
  ]);

  setBuilding(bRes.data);
  setUnits(Array.isArray(uRes.data) ? uRes.data : (uRes.data?.data ?? []));
};


  useEffect(() => {
    load();
  }, [buildingId]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post(`/buildings/${buildingId}/units`, form);
    setForm({ unit_number: '', floor: '', type: '', rent_amount: '', status: 'vacant' });
    load();
  };

  const handleDelete = async (id) => {
    await api.delete(`/units/${id}`);
    load();
  };

  const handleUpdate = async (unit) => {
    const nextRent = prompt('Update monthly rent', unit.rent_amount);
    if (!nextRent) return;
    await api.put(`/units/${unit.id}`, { ...unit, rent_amount: nextRent });
    load();
  };

  const occupancy = useMemo(() => {
    const occupied = units.filter((u) => u.status === 'occupied').length;
    return { occupied, total: units.length, vacant: units.length - occupied };
  }, [units]);

  return (
    <Layout>
      <div className="flex flex-col gap-1">
        <p className="text-[12px] uppercase tracking-[0.2em] text-slate-400">Inventory</p>
        <h2 className="text-3xl font-semibold text-white leading-tight">Units</h2>
        {building && <p className="text-sm text-slate-400">{building.name} • {building.address}</p>}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card
          title="Add Unit"
          description="Capture floor, type, rent, and status with helper text"
          className="lg:col-span-1"
        >
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <Label>Unit number</Label>
              <Input
                placeholder="A-201"
                name="unit_number"
                value={form.unit_number}
                onChange={handleChange}
                required
              />
              <p className="text-[12px] text-slate-500">Shown on all agreements and invoices.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Floor</Label>
                <Input
                  name="floor"
                  type="number"
                  inputMode="numeric"
                  step="1"
                  min="0"
                  value={form.floor}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === '' || Number.isInteger(Number(v))) {
                      setForm({ ...form, floor: v });
                    }
                  }}
                  placeholder="5"
                />
              </div>
              <div className="space-y-1">
                <Label>Type</Label>
                <Input name="type" value={form.type} onChange={handleChange} placeholder="2 bed" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Rent</Label>
                <Input name="rent_amount" value={form.rent_amount} onChange={handleChange} placeholder="12000" required />
              </div>
              <div className="space-y-1">
                <Label>Status</Label>
                <Select name="status" value={form.status} onChange={handleChange}>
                  <option value="vacant">Vacant</option>
                  <option value="occupied">Occupied</option>
                </Select>
              </div>
            </div>
            <Button type="submit" className="w-full">
              🏠 Add unit
            </Button>
          </form>
        </Card>

        <Card
          title="Unit Inventory"
          description="Toggle between dense table and cards"
          className="lg:col-span-2"
              actions={
                <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
                  {['table', 'cards'].map((mode) => (
                    <Button
                      key={mode}
                  variant={view === mode ? 'default' : 'ghost'}
                  size="sm"
                  className="rounded-lg"
                  onClick={() => setView(mode)}
                >
                  {mode === 'table' ? 'Table' : 'Grid'}
                </Button>
              ))}
            </div>
          }
        >
          {view === 'table' ? (
            <div className="table-shell overflow-x-auto">
              <table className="table-modern">
                <thead>
                  <tr>
                    <th>Unit</th>
                    <th>Floor</th>
                    <th>Type</th>
                    <th>Rent</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {units.map((u) => (
                    <tr key={u.id}>
                      <td className="font-semibold text-white">{u.unit_number}</td>
                      <td className="text-slate-300">{u.floor}</td>
                      <td className="text-slate-300">{u.type}</td>
                      <td className="text-slate-100">${u.rent_amount}</td>
                      <td>
                        <StatusBadge status={u.status} />
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-2 text-sm">
                          <button className="text-primary-200 hover:text-white" onClick={() => handleUpdate(u)}>
                            Edit
                          </button>
                          <button className="text-rose-400 hover:text-white" onClick={() => handleDelete(u.id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {units.map((u) => (
                <div key={u.id} className="glass-panel p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Unit</p>
                      <p className="text-xl font-semibold text-white">{u.unit_number}</p>
                    </div>
                    <StatusBadge status={u.status} />
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>{u.floor ? `Floor ${u.floor}` : '—'}</span>
                    <span>{u.type || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-white">${u.rent_amount}</p>
                    <div className="flex gap-2 text-xs">
                      <Button variant="ghost" size="sm" onClick={() => handleUpdate(u)}>
                        ✏️ Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(u.id)}>
                        🗑️ Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card title="Occupancy snapshot" description="Live mix" className="lg:max-w-xl">
        <div className="flex items-center gap-4">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 p-1">
            <div className="grid h-full w-full place-items-center rounded-full bg-ink text-center text-xs text-slate-200">
              <p className="text-lg font-semibold text-white">{occupancy.total || 0}</p>
              <span className="text-slate-400">units</span>
            </div>
          </div>
          <div className="space-y-2 text-sm text-slate-300">
            <p>
              <span className="text-white font-semibold">{occupancy.occupied}</span> occupied
            </p>
            <p>
              <span className="text-white font-semibold">{occupancy.vacant}</span> vacant
            </p>
          </div>
        </div>
      </Card>
    </Layout>
  );
};

export default Units;
