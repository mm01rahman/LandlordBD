<div className="grid gap-4 lg:grid-cols-3">
  <Card
    title="Create Agreement"
    description="Match tenant with unit"
    className="lg:col-span-1"
  >
    <form className="space-y-3" onSubmit={async (e) => {
      e.preventDefault();
      await api.post('/agreements', form);
      setForm({
        tenant_id: '',
        unit_id: '',
        start_date: '',
        end_date: '',
        monthly_rent: '',
        security_deposit: '',
      });
      load();
    }}>
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
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </Select>
      </div>

      <div className="space-y-1">
        <Label>Building</Label>
        <Select
          value={createBuildingId}
          onChange={async (e) => {
            const buildingId = e.target.value;
            setCreateBuildingId(buildingId);
            if (buildingId) {
              const { data } = await api.get(`/buildings/${buildingId}/units`);
              setUnits(data);
            } else setUnits([]);
            setForm(prev => ({ ...prev, unit_id: '' }));
          }}
        >
          <option value="">Select building</option>
          {buildings.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
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
            <option key={u.id} value={u.id}>{u.unit_number}</option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label>Start date</Label>
          <Input
            type="date"
            value={form.start_date}
            onChange={(e) => setForm({ ...form, start_date: e.target.value })}
            required
          />
        </div>
        <div className="space-y-1">
          <Label>End date</Label>
          <Input
            type="date"
            value={form.end_date}
            onChange={(e) => setForm({ ...form, end_date: e.target.value })}
          />
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

      <Button type="submit" className="w-full">📝 Save agreement</Button>
    </form>
  </Card>
</div>
