export const formatMonth = (value) => {
  if (!value) return '';
  const d = new Date(value);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    date: 'numeric',
  });
};

export const money = (v) => {
  if (v === null || v === undefined || isNaN(v)) return '৳0.00';
  return Number(v).toLocaleString('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 2,
  });
};
