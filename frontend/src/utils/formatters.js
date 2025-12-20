// src/utils/formatters.js

// ---- Workspace helpers ----
export const getWorkspaceCurrency = () =>
  localStorage.getItem('workspace_currency') || 'BDT';

export const getWorkspaceTimezone = () =>
  localStorage.getItem('workspace_timezone') || 'Asia/Dhaka';

// ---- Date formatting ----
export const formatMonth = (value, mode = 'month') => {
  if (!value) return '';

  // prevent timezone shift for YYYY-MM-DD strings
  const safeValue =
    typeof value === 'string' && value.length === 10
      ? `${value}T00:00:00`
      : value;

  const d = new Date(safeValue);
  if (Number.isNaN(d.getTime())) return String(value);

  const options =
    mode === 'date'
      ? { year: 'numeric', month: 'short', day: '2-digit' }
      : { year: 'numeric', month: 'short' };

  return d.toLocaleDateString('en-GB', options);
};

// ---- Money formatting ----
export const money = (v) => {
  const n = Number(v);
  const currency = getWorkspaceCurrency();

  return (Number.isFinite(n) ? n : 0).toLocaleString('en-BD', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};