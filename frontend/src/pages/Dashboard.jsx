import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import api from '../api/axiosInstance';
import Layout from '../components/Layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';


const Dashboard = () => {
  return (
    <Layout>
      {/* Header row */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-white lg:text-3xl">
            Portfolio overview
          </h1>
        </div>
       </motion.div>
    </Layout>
  );
};

export default Dashboard;
