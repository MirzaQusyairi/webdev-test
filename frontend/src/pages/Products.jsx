import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  IconButton,
  Card,
  CardContent,
  Grid,
  Chip,
  Fab,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Inventory,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { productsAPI } from '../api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    product_code: '',
    product_name: '',
    stock: '',
    price: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      setProducts(response.data.data || response.data);
    } catch (error) {
      showSnackbar('Failed to fetch products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenDialog = (product = null) => {
    setEditingProduct(product);
    setFormData(
      product
        ? {
            product_code: product.product_code,
            product_name: product.product_name,
            stock: product.stock.toString(),
            price: product.price.toString(),
          }
        : {
            product_code: '',
            product_name: '',
            stock: '',
            price: '',
          }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setFormData({
      product_code: '',
      product_name: '',
      stock: '',
      price: '',
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        stock: parseInt(formData.stock),
        price: parseFloat(formData.price),
      };

      if (editingProduct) {
        await productsAPI.update(editingProduct.id, data);
        showSnackbar('Product updated successfully');
      } else {
        await productsAPI.create(data);
        showSnackbar('Product created successfully');
      }

      handleCloseDialog();
      fetchProducts();
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || 'Failed to save product',
        'error'
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.delete(id);
        showSnackbar('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        showSnackbar('Failed to delete product', 'error');
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
    { field: 'product_code', headerName: 'Kode Produk', width: 150 },
    { field: 'product_name', headerName: 'Nama Produk', width: 200, flex: 1 },
    {
      field: 'stock',
      headerName: 'Stok',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value > 10 ? 'success' : params.value > 0 ? 'warning' : 'error'}
          size="small"
        />
      ),
    },
    {
      field: 'price',
      headerName: 'Harga',
      width: 150,
      renderCell: (params) => formatCurrency(params.value),
    },
    {
      field: 'actions',
      headerName: 'Aksi',
      width: 120,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => handleOpenDialog(params.row)}
            color="primary"
          >
            <Edit />
          </IconButton>
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
            Produk
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Kelola daftar produk
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          size="large"
        >
          Tambah Produk
        </Button>
      </Box>

      <Card>
        <CardContent>
          <DataGrid
            rows={products}
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

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingProduct ? 'Edit Produk' : 'Tambah Produk'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  name="product_code"
                  label="Kode Produk"
                  value={formData.product_code}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="product_name"
                  label="Nama Produk"
                  value={formData.product_name}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="stock"
                  label="Stok"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  fullWidth
                  required
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="price"
                  label="Harga"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  fullWidth
                  required
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Batal</Button>
            <Button type="submit" variant="contained">
              {editingProduct ? 'Update' : 'Simpan'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

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

export default Products;
