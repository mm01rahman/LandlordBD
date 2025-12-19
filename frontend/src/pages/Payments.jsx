const [payments, setPayments] = useState([]);
const [agreements, setAgreements] = useState([]);
const [tenants, setTenants] = useState([]);
const [filters, setFilters] = useState({ month: '', tenant_id: '', status: '' });

useEffect(() => {
  api.get('/agreements').then((res) => setAgreements(res.data?.data ?? res.data ?? []));
  api.get('/tenants').then((res) => setTenants(res.data?.data ?? res.data ?? []));
}, []);

const load = () => {
  const params = {};
  if (filters.month) params.month = filters.month;
  if (filters.tenant_id) params.tenant_id = filters.tenant_id;
  if (filters.status) params.status = filters.status;

  return api.get('/payments', { params }).then((res) => setPayments(res.data?.data ?? []));
};

useEffect(() => {
  load();
}, [filters]);
