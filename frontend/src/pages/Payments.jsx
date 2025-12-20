import { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import Layout from '../components/Layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input, Label, Select, Textarea } from '../components/ui/form';
import { formatMonth, money } from '../utils/formatters';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [form, setForm] = useState({ agreement_id: '', billing_month: '', amount_due: '', amount_paid: '', payment_date: '', payment_method: '', notes: '' });
  const [filters, setFilters] = useState({ month: '', tenant_id: '', status: '' });

  const load = () => {
    const params = {};
    if (filters.month) params.month = filters.month;
    if (filters.tenant_id) params.tenant_id = filters.tenant_id;
    if (filters.status) params.status = filters.status;

    return api.get('/payments', { params }).then((res) => setPayments(res.data?.data ?? []));
  };

  useEffect(() => {
    api.get('/agreements').then((res) => setAgreements(res.data?.data ?? res.data ?? []));
    api.get('/tenants').then((res) => setTenants(res.data?.data ?? res.data ?? []));
  }, []);

  useEffect(() => {
    load();
  }, [filters]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      billing_month: form.billing_month,
    };
    await api.post('/payments', payload);
    setForm({ agreement_id: '', billing_month: '', amount_due: '', amount_paid: '', payment_date: '', payment_method: '', notes: '' });
    load(); 
  };

  return (
    <Layout>
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-semibold text-white leading-tight">Payments</h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Record Payment" className="lg:col-span-1">
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <Label>Agreement</Label>
              <Select
                name="agreement_id"
                value={form.agreement_id}
                onChange={(e) => setForm({ ...form, agreement_id: e.target.value, amount_due: agreements.find((a) => a.id === Number(e.target.value))?.monthly_rent || '' })}
                required
              >
                <option value="">Select agreement</option>
                {agreements.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.tenant?.name} - {a.unit?.unit_number}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Billing month</Label>
                <Input type="month" name="billing_month" value={form.billing_month} onChange={handleChange} required />
              </div>
              <div className="space-y-1">
                <Label>Payment date</Label>
                <Input type="date" name="payment_date" value={form.payment_date} onChange={handleChange} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Amount due</Label>
                <Input placeholder="Amount due" name="amount_due" value={form.amount_due} onChange={handleChange} required />
              </div>
              <div className="space-y-1">
                <Label>Amount paid</Label>
                <Input placeholder="Amount paid" name="amount_paid" value={form.amount_paid} onChange={handleChange} required />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Payment method</Label>
              <Input placeholder="Bank transfer" name="payment_method" value={form.payment_method} onChange={handleChange} />
              <p className="text-[12px] text-slate-500">Example: Bank transfer, Cash, Card.</p>
            </div>
            <div className="space-y-1">
              <Label>Notes</Label>
              <Textarea placeholder="Reference or notes" name="notes" value={form.notes} onChange={handleChange} />
            </div>
            <Button type="submit" className="w-full">
              💳 Save payment
            </Button>
          </form>
        </Card>

        <Card
          title="Payment Ledger"
          description="Filter incoming rent"
          className="lg:col-span-2"
          actions={
            <div className="flex flex-wrap gap-2">
              <Input type="month" value={filters.month} onChange={(e) => setFilters({ ...filters, month: e.target.value })} className="w-36" />
              <Select value={filters.tenant_id} onChange={(e) => setFilters({ ...filters, tenant_id: e.target.value })} className="w-40">
                <option value="">All tenants</option>
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </Select>
              <Select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="w-32">
                <option value="">All status</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="unpaid">Unpaid</option>
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
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td className="text-white">{p.tenant?.name}</td>
                    <td className="text-slate-300">{p.unit?.unit_number}</td>
                    <td className="text-slate-300">{formatMonth(p.billing_month)}</td>
                    <td className="text-slate-100">${money(p.amount_due)}</td>
                    <td className="text-slate-100">${money(p.amount_paid)}</td>
                    <td className="text-slate-200">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold">
                        {p.status === 'paid' ? '✅ Paid' : p.status === 'partial' ? '⏳ Partial' : '⚠️ Unpaid'}
                      </span>
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

export default Payments;
