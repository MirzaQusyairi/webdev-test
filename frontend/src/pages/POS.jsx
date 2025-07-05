import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Autocomplete,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Divider,
  Alert,
  Snackbar,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingCart,
  Person,
  Receipt,
} from '@mui/icons-material';
import { customersAPI, productsAPI, salesAPI } from '../api';
import dayjs from 'dayjs';

const POS = () => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await customersAPI.getAll();
      setCustomers(response.data.data || response.data);
    } catch (error) {
      showSnackbar('Failed to fetch customers', 'error');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data.data || response.data);
    } catch (error) {
      showSnackbar('Failed to fetch products', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const addToCart = () => {
    if (!selectedProduct || quantity <= 0) {
      showSnackbar('Please select a product and valid quantity', 'warning');
      return;
    }

    if (quantity > selectedProduct.stock) {
      showSnackbar('Insufficient stock', 'error');
      return;
    }

    const existingItemIndex = cart.findIndex(item => item.product.id === selectedProduct.id);
    
    if (existingItemIndex >= 0) {
      const newCart = [...cart];
      const newQuantity = newCart[existingItemIndex].quantity + quantity;
      
      if (newQuantity > selectedProduct.stock) {
        showSnackbar('Insufficient stock', 'error');
        return;
      }
      
      newCart[existingItemIndex].quantity = newQuantity;
      newCart[existingItemIndex].total = newQuantity * selectedProduct.price;
      setCart(newCart);
    } else {
      const newItem = {
        product: selectedProduct,
        quantity: quantity,
        price: selectedProduct.price,
        total: quantity * selectedProduct.price,
      };
      setCart([...cart, newItem]);
    }

    setSelectedProduct(null);
    setQuantity(1);
    showSnackbar('Product added to cart');
  };

  const updateCartQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(index);
      return;
    }

    const item = cart[index];
    if (newQuantity > item.product.stock) {
      showSnackbar('Insufficient stock', 'error');
      return;
    }

    const newCart = [...cart];
    newCart[index].quantity = newQuantity;
    newCart[index].total = newQuantity * item.price;
    setCart(newCart);
  };

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    showSnackbar('Product removed from cart');
  };

  const clearCart = () => {
    setCart([]);
    setSelectedCustomer(null);
  };

  const getTotalAmount = () => {
    return cart.reduce((sum, item) => sum + item.total, 0);
  };

  const processTransaction = async () => {
    if (!selectedCustomer) {
      showSnackbar('Please select a customer', 'warning');
      return;
    }

    if (cart.length === 0) {
      showSnackbar('Cart is empty', 'warning');
      return;
    }

    setLoading(true);
    try {
      // Create multiple sales records (one for each product)
      const salesPromises = cart.map(item => 
        salesAPI.create({
          customer_id: selectedCustomer.id,
          product_id: item.product.id,
          quantity: item.quantity,
          total_price: item.total,
          order_date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        })
      );

      await Promise.all(salesPromises);
      
      showSnackbar('Transaction completed successfully', 'success');
      clearCart();
      fetchProducts(); // Refresh products to update stock
    } catch (error) {
      console.error('Transaction error:', error);
      showSnackbar(
        error.response?.data?.message || 'Failed to process transaction',
        'error'
      );
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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Point of Sale (POS)
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Sistem kasir untuk transaksi penjualan
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Product Selection */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <ShoppingCart sx={{ mr: 1, verticalAlign: 'middle' }} />
                Pilih Produk
              </Typography>
              
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    value={selectedProduct}
                    onChange={(_, newValue) => setSelectedProduct(newValue)}
                    options={products}
                    getOptionLabel={(option) => `${option.product_code} - ${option.product_name}`}
                    renderInput={(params) => (
                      <TextField {...params} label="Cari Produk" fullWidth />
                    )}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <Box>
                          <Typography variant="body1">
                            {option.product_code} - {option.product_name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Stok: {option.stock} | Harga: {formatCurrency(option.price)}
                          </Typography>
                        </Box>
                      </li>
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Jumlah"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    fullWidth
                    inputProps={{ min: 1 }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Button
                    variant="contained"
                    onClick={addToCart}
                    fullWidth
                    size="large"
                    startIcon={<Add />}
                  >
                    Tambah ke Keranjang
                  </Button>
                </Grid>
              </Grid>

              {selectedProduct && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                  <Typography variant="body1">
                    <strong>{selectedProduct.product_name}</strong>
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Kode: {selectedProduct.product_code} | 
                    Stok: {selectedProduct.stock} | 
                    Harga: {formatCurrency(selectedProduct.price)}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Shopping Cart */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Keranjang Belanja
              </Typography>
              
              {cart.length === 0 ? (
                <Alert severity="info">Keranjang kosong</Alert>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Produk</TableCell>
                        <TableCell align="center">Harga</TableCell>
                        <TableCell align="center">Jumlah</TableCell>
                        <TableCell align="center">Total</TableCell>
                        <TableCell align="center">Aksi</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cart.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography variant="body1">
                              {item.product.product_name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {item.product.product_code}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            {formatCurrency(item.price)}
                          </TableCell>
                          <TableCell align="center">
                            <Box display="flex" alignItems="center" justifyContent="center">
                              <IconButton
                                size="small"
                                onClick={() => updateCartQuantity(index, item.quantity - 1)}
                              >
                                <Remove />
                              </IconButton>
                              <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                              <IconButton
                                size="small"
                                onClick={() => updateCartQuantity(index, item.quantity + 1)}
                              >
                                <Add />
                              </IconButton>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            {formatCurrency(item.total)}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              color="error"
                              onClick={() => removeFromCart(index)}
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3}>
                          <Typography variant="h6">Total</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="h6" color="primary">
                            {formatCurrency(getTotalAmount())}
                          </Typography>
                        </TableCell>
                        <TableCell />
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Customer Selection & Checkout */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                Pilih Pelanggan
              </Typography>
              
              <Autocomplete
                value={selectedCustomer}
                onChange={(_, newValue) => setSelectedCustomer(newValue)}
                options={customers}
                getOptionLabel={(option) => option.customer_name}
                renderInput={(params) => (
                  <TextField {...params} label="Cari Pelanggan" fullWidth />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box>
                      <Typography variant="body1">
                        {option.customer_name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {option.customer_address}
                      </Typography>
                    </Box>
                  </li>
                )}
              />

              {selectedCustomer && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                  <Typography variant="body1">
                    <strong>{selectedCustomer.customer_name}</strong>
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {selectedCustomer.customer_address}
                  </Typography>
                  <Chip
                    label={selectedCustomer.gender}
                    size="small"
                    color={selectedCustomer.gender === 'Pria' ? 'primary' : 'secondary'}
                    sx={{ mt: 1 }}
                  />
                </Box>
              )}
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ringkasan Transaksi
              </Typography>
              
              <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography>Jumlah Item:</Typography>
                <Typography>{cart.reduce((sum, item) => sum + item.quantity, 0)}</Typography>
              </Box>
              
              <Box display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography>Total Produk:</Typography>
                <Typography>{cart.length}</Typography>
              </Box>
              
              <Divider />
              
              <Box display="flex" justifyContent="space-between" sx={{ mt: 2, mb: 3 }}>
                <Typography variant="h6">Total Bayar:</Typography>
                <Typography variant="h6" color="primary">
                  {formatCurrency(getTotalAmount())}
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={clearCart}
                    disabled={cart.length === 0}
                  >
                    Clear
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={processTransaction}
                    disabled={loading || cart.length === 0 || !selectedCustomer}
                    startIcon={<Receipt />}
                  >
                    {loading ? 'Processing...' : 'Checkout'}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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

export default POS;
