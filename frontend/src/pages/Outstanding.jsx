import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Card } from '../components/ui/card';
import { Input, Select } from '../components/ui/form';

const Outstanding = () => {
  const [rows, setRows] = useState([]);
  const [filters, setFilters] = useState({
    month: '',
    tenant_id: '',
    building_id: '',
  });
  const [tenants, setTenants] = useState([]);
  const [buildings, setBuildings] = useState([]);

  return (
    <Layout>
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Collections
        </p>
        <h2 className="text-2xl font-semibold text-white">
          Outstanding Rent
        </h2>
      </div>

      <Card
        title="Outstanding Dues"
        description="Filter unpaid or partially paid rent"
        actions={
          <div className="flex flex-wrap gap-2">
            <Input
              type="month"
              value={filters.month}
              onChange={(e) => setFilters({ ...filters, month: e.target.value })}
              className="w-40"
            />
            <Select
              value={filters.tenant_id}
              onChange={(e) => setFilters({ ...filters, tenant_id: e.target.value })}
              className="w-40"
            >
              <option value="">All tenants</option>
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </Select>
            <Select
              value={filters.building_id}
              onChange={(e) => setFilters({ ...filters, building_id: e.target.value })}
              className="w-40"
            >
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
                <th>Month</th>
                <th>Due</th>
                <th>Paid</th>
                <th>Remaining</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {/* Rows will be populated later */}
            </tbody>
          </table>
        </div>
      </Card>
    </Layout>
  );
};

export default Outstanding;
