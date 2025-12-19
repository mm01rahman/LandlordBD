import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Card } from '../components/ui/card';

const Outstanding = () => {
  const [rows, setRows] = useState([]);
  const [filters, setFilters] = useState({
    month: '',
    tenant_id: '',
    building_id: '',
  });

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
