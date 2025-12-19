<Card
  title="Agreements Pipeline"
  description="Filter by status, tenant, or building"
  className="lg:col-span-2"
  actions={
    <div className="flex flex-wrap gap-2">
      <Select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})} className="w-36">
        <option value="">All statuses</option>
        <option value="active">Active</option>
        <option value="ended">Ended</option>
        <option value="upcoming">Upcoming</option>
      </Select>
      <Select value={filters.tenant_id} onChange={(e) => setFilters({...filters, tenant_id: e.target.value})} className="w-40">
        <option value="">All tenants</option>
        {tenants.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
      </Select>
      <Select value={filters.building_id} onChange={(e) => setFilters({...filters, building_id: e.target.value})} className="w-40">
        <option value="">All buildings</option>
        {buildings.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
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
          <th>Start</th>
          <th>End</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {agreements.map((a) => (
          <tr key={a.id}>
            <td className="text-white">{a.tenant?.name}</td>
            <td className="text-slate-300">{a.unit?.building?.name} – {a.unit?.unit_number}</td>
            <td className="text-slate-300">{a.start_date}</td>
            <td className="text-slate-300">{a.end_date || a.end_date_actual || '—'}</td>
            <td className="text-slate-200">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold">
                {a.status === 'active' ? 'Active' : a.status === 'upcoming' ? 'Upcoming' : 'Ended'}
              </span>
            </td>
            <td>
              {a.status === 'active' && (
                <Button variant="ghost" size="sm" onClick={() => api.post(`/agreements/${a.id}/end`).then(load)}>
                  End
                </Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</Card>
