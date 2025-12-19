import { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import Layout from '../components/Layout';
import { Card } from '../components/ui/card';
import { Input, Label, Select } from '../components/ui/form';
import { extractArray } from '../utils/normalize';

const Agreements = () => {
  const [agreements, setAgreements] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [units, setUnits] = useState([]);
  const [createBuildingId, setCreateBuildingId] = useState('');
  const [filters, setFilters] = useState({ status: '', tenant_id: '', building_id: '' });
  const [form, setForm] = useState({
    tenant_id: '',
    unit_id: '',
    start_date: '',
    end_date: '',
    monthly_rent: '',
    security_deposit: '',
  });

  const load = () => {
    api.get('/agreements', { params: filters }).then((res) =>
      setAgreements(extractArray(res)),
    );
  };

  useEffect(() => {
    api.get('/tenants').then((res) => setTenants(extractArray(res)));
    api.get('/buildings').then((res) => setBuildings(extractArray(res)));
  }, []);

  useEffect(() => {
    load();
  }, [filters]);

  return <Layout></Layout>;
};

export default Agreements;
