import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  People,
  Inventory,
  ShoppingCart,
} from '@mui/icons-material';
import { salesAPI, customersAPI, productsAPI } from '../api';

const StatCard = ({ title, value, icon, color = 'primary' }) => (
  <Card elevation={3}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="h6">
            {title}
          </Typography>
          <Typography variant="h4" component="h2" color={color}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: `${color}.light`,
            borderRadius: '50%',
            p: 2,
            color: `${color}.main`,
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [salesResponse, customersResponse, productsResponse] = await Promise.all([
        salesAPI.getAll(),
        customersAPI.getAll(),
        productsAPI.getAll(),
      ]);

      const sales = salesResponse.data.data || salesResponse.data;
      const customers = customersResponse.data.data || customersResponse.data;
      const products = productsResponse.data.data || productsResponse.data;

      const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.total_price), 0);

      setStats({
        totalSales: sales.length,
        totalRevenue: totalRevenue,
        totalCustomers: customers.length,
        totalProducts: products.length,
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Ringkasan penjualan dan statistik
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Transaksi"
            value={stats.totalSales}
            icon={<ShoppingCart fontSize="large" />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Penjualan"
            value={formatCurrency(stats.totalRevenue)}
            icon={<TrendingUp fontSize="large" />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Pelanggan"
            value={stats.totalCustomers}
            icon={<People fontSize="large" />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Produk"
            value={stats.totalProducts}
            icon={<Inventory fontSize="large" />}
            color="warning"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Selamat Datang di Sales Dashboard
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Kelola produk, pelanggan, dan transaksi penjualan Anda dengan mudah. 
              Gunakan menu navigasi di sebelah kiri untuk mengakses berbagai fitur.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
