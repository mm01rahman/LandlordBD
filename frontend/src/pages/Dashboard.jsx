import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import api from '../api/axiosInstance';
import Layout from '../components/Layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { formatMonth, money } from '../utils/formatters';

// small donut pie (occupied vs vacant)
const OccupancyPie = ({ occupied = 0, vacant = 0, size = 96 }) => {
  const total = occupied + vacant || 1;
  const occupiedPct = (occupied / total) * 100;

  const radius = size / 2 - 6;
  const circumference = 2 * Math.PI * radius;
  const dash = (occupiedPct / 100) * circumference;

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="rgb(51 65 85)" // slate-700
        strokeWidth="10"
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="rgb(16 185 129)" // emerald-500
        strokeWidth="10"
        fill="none"
        strokeDasharray={`${dash} ${circumference}`}
        strokeLinecap="round"
      />
    </svg>
  );
};

const TrendRow = ({ label, value, delta, status }) => (
  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
    <div>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="text-lg font-semibold text-white">{value}</p>
      <p className="text-[13px] text-slate-400">{status}</p>
    </div>
    <span
      className={`text-sm font-semibold inline-flex items-center gap-1 ${
        delta >= 0 ? 'text-emerald-300' : 'text-rose-300'
      }`}
    >
      {delta >= 0 ? '⬆︎' : '⬇︎'} {Math.abs(delta).toFixed(1)}%
    </span>
  </div>
);

const periodLabelMap = {
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
  '90d': 'Last 90 days',
  YTD: 'Year to date',
};

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [compare, setCompare] = useState(null);
  const [period, setPeriod] = useState('30d');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const periodLabel = periodLabelMap[period] || '';

  const prevPeriod = useMemo(() => {
    if (period === '7d') return '7d_prev';
    if (period === '30d') return '30d_prev';
    if (period === '90d') return '90d_prev';
    if (period === 'YTD') return 'YTD_prev';
    return '30d_prev';
  }, [period]);

  useEffect(() => {
    let live = true;
    setLoading(true);
    setError('');

    Promise.all([
      api.get('/dashboard/summary', { params: { period } }),
      api.get('/dashboard/summary', { params: { period: prevPeriod } }),
    ])
      .then(([curRes, prevRes]) => {
        if (!live) return;
        setSummary(curRes.data);
        setCompare(prevRes.data);
      })
      .catch((err) => {
        console.error('Failed to load dashboard summary', err?.response?.data || err);
        if (!live) return;
        setError('Unable to load metrics right now. Please try again.');
        setSummary(null);
        setCompare(null);
      })
      .finally(() => {
        if (!live) return;
        setLoading(false);
      });

    return () => {
      live = false;
    };
  }, [period, prevPeriod, refreshKey]);

  const curRent = summary?.total_rent_collected ?? 0;
  const curOutstanding = summary?.total_outstanding ?? 0;
  const curOcc = summary?.total_occupied_units ?? 0;
  const curVac = summary?.total_vacant_units ?? 0;
  const curUnits = summary?.total_units ?? curOcc + curVac;

  const rentTrend = summary?.rent_collection_trend ?? [];
  const upcomingRenewals = summary?.upcoming_renewals ?? [];

  const prevRent = compare?.total_rent_collected ?? 0;
  const prevOutstanding = compare?.total_outstanding ?? 0;
  const prevOcc = compare?.total_occupied_units ?? 0;

  const pct = (current, prev) => {
    if (!prev || prev === 0) return current > 0 ? 100 : 0;
    return ((current - prev) / prev) * 100;
  };

  const rentDelta = pct(curRent, prevRent);
  const outstandingDelta = pct(curOutstanding, prevOutstanding);
  const occDelta = pct(curOcc, prevOcc);

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-white lg:text-3xl">
            Portfolio overview
          </h1>
          <p className="text-sm text-slate-400 max-w-xl">
            Track rent collections, outstanding balances, and occupancy across your properties in one glance.
          </p>
        </div>

        <Card title="Time range" className="w-full max-w-xs space-y-3">
          <div className="grid grid-cols-4 gap-2">
            {['7d', '30d', '90d', 'YTD'].map((p) => (
              <Button
                key={p}
                variant={period === p ? 'default' : 'subtle'}
                size="sm"
                className="w-full"
                onClick={() => setPeriod(p)}
              >
                {p}
              </Button>
            ))}
          </div>
          <p className="text-[13px] text-slate-400">
            Currently viewing:{' '}
            <span className="font-medium text-slate-200">{periodLabel}</span>
          </p>
        </Card>
      </motion.div>

      {loading && !summary ? (
        <p className="text-slate-400">Loading metrics...</p>
      ) : error ? (
        <div className="space-y-3 text-slate-300">
          <p>{error}</p>
          <Button variant="outline" size="sm" onClick={() => setRefreshKey((k) => k + 1)}>
            Retry
          </Button>
        </div>
      ) : !summary ? (
        <p className="text-slate-400">No data available for this period.</p>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* KPI strip */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-white/0 to-accent-500/10" />
              <div className="relative space-y-2">
                <p className="text-[12px] uppercase tracking-[0.2em] text-slate-400">
                  Total Rent (Period)
                </p>
                <p className="text-3xl font-semibold text-white leading-tight">
                  {money(curRent)}
                </p>
                <p className="text-sm text-slate-300">
                  vs prev:{' '}
                  <span className={rentDelta >= 0 ? 'text-emerald-300' : 'text-rose-300'}>
                    {rentDelta >= 0 ? '+' : ''}{rentDelta.toFixed(1)}%
                  </span>
                </p>
              </div>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-white/0 to-accent-500/10" />
              <div className="relative space-y-2">
                <p className="text-[12px] uppercase tracking-[0.2em] text-slate-400">
                  Outstanding (Period)
                </p>
                <p className="text-3xl font-semibold text-white leading-tight">
                  {money(curOutstanding)}
                </p>
                <p className="text-sm text-slate-300">
                  vs prev:{' '}
                  <span className={outstandingDelta <= 0 ? 'text-emerald-300' : 'text-rose-300'}>
                    {outstandingDelta >= 0 ? '+' : ''}{outstandingDelta.toFixed(1)}%
                  </span>
                </p>
              </div>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-white/0 to-accent-500/10" />
              <div className="relative space-y-2">
                <p className="text-[12px] uppercase tracking-[0.2em] text-slate-400">
                  Occupied Units
                </p>
                <p className="text-3xl font-semibold text-white leading-tight">
                  {curOcc}
                </p>
                <p className="text-sm text-slate-300">
                  vs prev:{' '}
                  <span className={occDelta >= 0 ? 'text-emerald-300' : 'text-rose-300'}>
                    {occDelta >= 0 ? '+' : ''}{occDelta.toFixed(1)}%
                  </span>
                </p>
              </div>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-white/0 to-accent-500/10" />
              <div className="relative space-y-2">
                <p className="text-[12px] uppercase tracking-[0.2em] text-slate-400">
                  Vacant Units
                </p>
                <p className="text-3xl font-semibold text-white leading-tight">
                  {curVac}
                </p>
                <p className="text-sm text-slate-400">
                  Total units:{' '}
                  <span className="text-slate-200 font-medium">{curUnits}</span>
                </p>
              </div>
            </Card>
          </div>

          {/* Trend + Momentum */}
          <div className="grid gap-4 lg:grid-cols-3">
            <Card title="Rent collection trend" className="lg:col-span-2">
              {rentTrend.length ? (
                <div className="space-y-3">
                  {rentTrend.map((block) => (
                    <div
                      key={block.month}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      {/* Month header */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="h-10 w-10 rounded-full bg-primary-500/15 text-primary-100 grid place-items-center font-semibold">
                            {String(block.month).slice(5, 7)}
                          </span>
                          <div>
                            <p className="text-sm text-slate-300">{block.month}</p>
                            <p className="text-[13px] text-slate-400">Top contributors</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-[12px] uppercase tracking-[0.2em] text-slate-400">
                            Total
                          </p>
                          <p className="text-lg font-semibold text-white">
                            {money(block.month_total ?? 0)}
                          </p>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="mt-3 space-y-2">
                        {(block.items ?? []).map((it, idx) => (
                          <div
                            key={`${block.month}-${idx}`}
                            className="flex items-center justify-between rounded-xl border border-white/10 bg-ink/40 px-3 py-2"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-100">
                                {it.tenant_name || 'Unknown tenant'}
                              </p>
                              <p className="truncate text-[12px] text-slate-400">
                                {it.building_name || 'Unknown building'}
                              </p>
                            </div>

                            <span className="shrink-0 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200 border border-emerald-500/20">
                              {money(it.total ?? 0)}
                            </span>
                          </div>
                        ))}

                        {(!block.items || block.items.length === 0) && (
                          <p className="text-sm text-slate-400">No contributors in this month.</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">No rent trend data for this period.</p>
              )}
            </Card>

            <Card title="Income momentum" description={`${periodLabel} vs previous`} className="space-y-3">
              <TrendRow
                label="Collections"
                value={money(curRent)}
                delta={rentDelta}
                status="Compared to previous period"
              />
              <TrendRow
                label="Outstanding"
                value={money(curOutstanding)}
                delta={outstandingDelta}
                status="Lower is better"
              />
              <TrendRow
                label="Occupancy"
                value={`${curOcc}/${curUnits}`}
                delta={occDelta}
                status="Occupied share movement"
              />
            </Card>
          </div>

          {/* Occupancy + Renewals */}
          <div className="grid gap-4 lg:grid-cols-3">
            <Card title="Occupancy snapshot" description="Occupied vs vacant units" className="space-y-4 lg:col-span-2">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <OccupancyPie occupied={curOcc} vacant={curVac} size={96} />
                    <div className="absolute inset-0 grid place-items-center text-center">
                      <p className="text-lg font-semibold text-white">{curUnits}</p>
                      <span className="text-xs text-slate-400">units</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-slate-300">
                    <p className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-emerald-500" />
                      <span><span className="text-white font-semibold">{curOcc}</span> occupied</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-slate-600" />
                      <span><span className="text-white font-semibold">{curVac}</span> vacant</span>
                    </p>
                  </div>
                </div>

                <div className="w-full max-w-md space-y-2">
                  <div className="flex justify-between text-[13px] text-slate-400">
                    <span>Occupancy</span>
                    <span>{curOcc} occupied • {curVac} vacant</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-white/5">
                    {(() => {
                      const total = curUnits || 1;
                      const occupiedPct = (curOcc / total) * 100;
                      return (
                        <div className="h-full rounded-full bg-emerald-400/80" style={{ width: `${occupiedPct}%` }} />
                      );
                    })()}
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Upcoming lease renewals" description="Next 30 days" className="space-y-3">
              {upcomingRenewals.length ? (
                <div className="space-y-2">
                  {upcomingRenewals.slice(0, 5).map((lease) => (
                    <div key={lease.id} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                      <div className="min-w-0">
                        <p className="text-sm text-slate-100 truncate">
                          {lease.tenant_name} • {lease.unit_code}
                        </p>
                        <p className="text-[12px] text-slate-400 truncate">
                          {lease.building_name ? `${lease.building_name} • ` : ''}Ends on {formatMonth(lease.end_date)}
                        </p>
                      </div>
                      <span className="text-[12px] rounded-full bg-amber-500/10 px-2 py-1 text-amber-200 border border-amber-500/20">
                        {lease.days_remaining} days left
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-slate-400">No renewals in the next 30 days.</p>
              )}
            </Card>
          </div>
        </motion.div>
      )}
    </Layout>
  );
};

export default Dashboard;
