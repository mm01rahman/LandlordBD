import { useEffect, useMemo, useState } from 'react';
import api from '../api/axiosInstance';
import Layout from '../components/Layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input, Label, Select } from '../components/ui/form';

const Settings = () => {
  const timezoneOptions = useMemo(
    () => ['Asia/Dhaka', 'Asia/Kolkata', 'Asia/Singapore', 'Europe/London', 'America/New_York', 'UTC'],
    [],
  );

  const currencyOptions = useMemo(
    () => [
      { value: 'BDT', label: 'BDT — Bangladeshi Taka' },
      { value: 'USD', label: 'USD — US Dollar' },
      { value: 'EUR', label: 'EUR — Euro' },
      { value: 'GBP', label: 'GBP — British Pound' },
    ],
    [],
  );

  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [workspace, setWorkspace] = useState({
    name: 'LandlordBD',
    language: 'English',
    timezone: 'Asia/Dhaka',
    currency: 'BDT',
  });

  const toast = (msg) => {
    setStatus(msg);
    window.clearTimeout(toast._t);
    toast._t = window.setTimeout(() => setStatus(''), 2500);
  };

  // Load saved defaults from backend
  useEffect(() => {
    let live = true;
    setLoading(true);

    api
      .get('/settings/workspace')
      .then((res) => {
        if (!live) return;
        setWorkspace({
          name: res.data?.name ?? 'LandlordBD',
          language: res.data?.language ?? 'English',
          timezone: res.data?.timezone ?? 'Asia/Dhaka',
          currency: res.data?.currency ?? 'BDT',
        });
      })
      .catch(() => {
        if (!live) return;
        toast('Could not load workspace settings. Using local defaults.');
      })
      .finally(() => {
        if (!live) return;
        setLoading(false);
      });

    return () => {
      live = false;
    };
  }, []);

  const saveDefaults = async () => {
    if (saving) return;
    setSaving(true);

    try {
      const res = await api.put('/settings/workspace', workspace);

      // Store locally too so the app can instantly use it (even before refresh)
      localStorage.setItem('workspace_settings', JSON.stringify(res.data));

      // Optional: also store currency/timezone individually for quick access
      localStorage.setItem('workspace_currency', res.data.currency);
      localStorage.setItem('workspace_timezone', res.data.timezone);

      toast('✅ Workspace defaults saved.');
    } catch (err) {
      console.error(err?.response?.data || err);
      toast('❌ Failed to save defaults. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-2 pb-2">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Settings</h2>
            <p className="text-sm text-slate-400">Save defaults used across the app.</p>
          </div>
        </div>
      </div>

      {status && (
        <div
          className="rounded-xl border border-primary-400/30 bg-primary-500/15 px-4 py-3 text-sm text-primary-50 shadow-brand"
          role="status"
        >
          {status}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card
          className="lg:col-span-2"
          title="Defaults"
          actions={
            <Button disabled={loading || saving} onClick={saveDefaults}>
              {saving ? 'Saving…' : 'Save defaults'}
            </Button>
          }
        >
          {loading ? (
            <p className="text-sm text-slate-400">Loading settings…</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="workspace-name">Workspace name</Label>
                <Input
                  id="workspace-name"
                  value={workspace.name}
                  onChange={(e) => setWorkspace({ ...workspace, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workspace-language">Language</Label>
                <Select
                  id="workspace-language"
                  value={workspace.language}
                  onChange={(e) => setWorkspace({ ...workspace, language: e.target.value })}
                >
                  {['English', 'Bengali', 'Spanish', 'French'].map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="workspace-timezone">Timezone</Label>
                <Select
                  id="workspace-timezone"
                  value={workspace.timezone}
                  onChange={(e) => setWorkspace({ ...workspace, timezone: e.target.value })}
                >
                  {timezoneOptions.map((zone) => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="workspace-currency">Currency</Label>
                <Select
                  id="workspace-currency"
                  value={workspace.currency}
                  onChange={(e) => setWorkspace({ ...workspace, currency: e.target.value })}
                >
                  {currencyOptions.map((currency) => (
                    <option key={currency.value} value={currency.value}>
                      {currency.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
