import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Alert,
  Snackbar,
  Chip,
} from '@mui/material';
import {
  Delete,
  Visibility,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { salesAPI } from '../api';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await salesAPI.getAll();
      const salesData = response.data.data || response.data;
      
      // Transform data to include customer and product names
      const transformedSales = salesData.map(sale => ({
        ...sale,
        customer_name: sale.customer?.customer_name || 'Unknown Customer',
        product_name: sale.product?.product_name || 'Unknown Product',
        product_code: sale.product?.product_code || 'N/A',
      }));
      
      setSales(transformedSales);
    } catch (error) {
      console.error('Error fetching sales:', error);
      showSnackbar('Failed to fetch sales data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await salesAPI.delete(id);
        showSnackbar('Transaction deleted successfully');
        fetchSales();
      } catch (error) {
        showSnackbar('Failed to delete transaction', 'error');
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  const columns = [
    {
      field: 'id',
      headerName: 'ID Transaksi',
      width: 120,
    },
    {
      field: 'customer_name',
      headerName: 'Pelanggan',
      width: 200,
      flex: 1,
    },
    {
      field: 'product_code',
      headerName: 'Kode Produk',
      width: 130,
    },
    {
      field: 'product_name',
      headerName: 'Nama Produk',
      width: 200,
      flex: 1,
    },
    {
      field: 'quantity',
      headerName: 'Jumlah',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color="primary"
          size="small"
        />
      ),
    },
    {
      field: 'total_price',
      headerName: 'Total Harga',
      width: 150,
      renderCell: (params) => formatCurrency(params.value),
    },
    {
      field: 'order_date',
      headerName: 'Tanggal Transaksi',
      width: 160,
      renderCell: (params) => dayjs(params.value).format('DD/MM/YYYY HH:mm'),
    },
    {
      field: 'actions',
      headerName: 'Aksi',
      width: 100,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => handleDelete(params.row.id)}
            color="error"
          >
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Transaksi Penjualan
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Daftar semua transaksi penjualan
          </Typography>
        </Box>
      </Box>

      <Card>
        <CardContent>
          <DataGrid
            rows={sales}
            columns={columns}
            loading={loading}
            autoHeight
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            disableSelectionOnClick
            sx={{
              '& .MuiDataGrid-root': {
                border: 'none',
              },
            }}
          />
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Sales;
