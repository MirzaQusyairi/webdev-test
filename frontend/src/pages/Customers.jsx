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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Person,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { customersAPI } from '../api';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_address: '',
    gender: '',
    birth_date: null,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customersAPI.getAll();
      setCustomers(response.data.data || response.data);
    } catch (error) {
      showSnackbar('Failed to fetch customers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenDialog = (customer = null) => {
    setEditingCustomer(customer);
    setFormData(
      customer
        ? {
            customer_name: customer.customer_name,
            customer_address: customer.customer_address,
            gender: customer.gender,
            birth_date: dayjs(customer.birth_date),
          }
        : {
            customer_name: '',
            customer_address: '',
            gender: '',
            birth_date: null,
          }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCustomer(null);
    setFormData({
      customer_name: '',
      customer_address: '',
      gender: '',
      birth_date: null,
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      birth_date: date,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        birth_date: formData.birth_date ? formData.birth_date.format('YYYY-MM-DD') : null,
      };

      if (editingCustomer) {
        await customersAPI.update(editingCustomer.id, data);
        showSnackbar('Customer updated successfully');
      } else {
        await customersAPI.create(data);
        showSnackbar('Customer created successfully');
      }

      handleCloseDialog();
      fetchCustomers();
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || 'Failed to save customer',
        'error'
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customersAPI.delete(id);
        showSnackbar('Customer deleted successfully');
        fetchCustomers();
      } catch (error) {
        showSnackbar('Failed to delete customer', 'error');
      }
    }
  };

  const calculateAge = (birthDate) => {
    const today = dayjs();
    const birth = dayjs(birthDate);
    return today.diff(birth, 'year');
  };

  const columns = [
    { field: 'customer_name', headerName: 'Nama', width: 200, flex: 1 },
    { field: 'customer_address', headerName: 'Alamat', width: 250, flex: 1 },
    {
      field: 'gender',
      headerName: 'Jenis Kelamin',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'Pria' ? 'primary' : 'secondary'}
          size="small"
        />
      ),
    },
    {
      field: 'birth_date',
      headerName: 'Tanggal Lahir',
      width: 130,
      renderCell: (params) => dayjs(params.value).format('DD/MM/YYYY'),
    },
    {
      field: 'age',
      headerName: 'Umur',
      width: 80,
      renderCell: (params) => `${calculateAge(params.row.birth_date)} th`,
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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Pelanggan
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Kelola data pelanggan
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            size="large"
          >
            Tambah Pelanggan
          </Button>
        </Box>

        <Card>
          <CardContent>
            <DataGrid
              rows={customers}
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
              {editingCustomer ? 'Edit Pelanggan' : 'Tambah Pelanggan'}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="customer_name"
                    label="Nama Pelanggan"
                    value={formData.customer_name}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Jenis Kelamin</InputLabel>
                    <Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      label="Jenis Kelamin"
                    >
                      <MenuItem value="Pria">Pria</MenuItem>
                      <MenuItem value="Wanita">Wanita</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="customer_address"
                    label="Alamat"
                    value={formData.customer_address}
                    onChange={handleChange}
                    fullWidth
                    required
                    multiline
                    rows={3}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Tanggal Lahir"
                    value={formData.birth_date}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params} fullWidth required />}
                    maxDate={dayjs()}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Batal</Button>
              <Button type="submit" variant="contained">
                {editingCustomer ? 'Update' : 'Simpan'}
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
    </LocalizationProvider>
  );
};

export default Customers;
