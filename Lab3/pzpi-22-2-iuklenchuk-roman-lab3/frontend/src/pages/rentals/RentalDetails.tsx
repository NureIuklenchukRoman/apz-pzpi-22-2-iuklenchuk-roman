import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Box,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Warehouse as WarehouseIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import api from '../../services/api';

interface Rental {
  id: string;
  warehouseId: string;
  warehouseName: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: 'active' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
}

const RentalDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [rental, setRental] = useState<Rental | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchRentalDetails();
  }, [id]);

  const fetchRentalDetails = async () => {
    try {
      const response = await api.get(`/users/my_rents/${id}`);
      setRental(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch rental details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!rental) return;

    setCancelling(true);
    setError('');

    try {
      await api.post(`/rentals/${id}/cancel`);
      fetchRentalDetails();
      setCancelDialogOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to cancel rental');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'info';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'refunded':
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!rental) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">Rental not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Rental Details
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label={rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
              color={getStatusColor(rental.status)}
            />
            <Chip
              label={`Payment: ${rental.paymentStatus.charAt(0).toUpperCase() + rental.paymentStatus.slice(1)}`}
              color={getPaymentStatusColor(rental.paymentStatus)}
            />
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Rental Information
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WarehouseIcon sx={{ mr: 1 }} />
                <Typography>
                  Warehouse: {rental.warehouseName}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarIcon sx={{ mr: 1 }} />
                <Typography>
                  Period: {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MoneyIcon sx={{ mr: 1 }} />
                <Typography>
                  Total Amount: ${rental.totalAmount}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ReceiptIcon sx={{ mr: 1 }} />
                <Typography>
                  Created: {new Date(rental.createdAt).toLocaleString()}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Actions
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mb: 2 }}
                onClick={() => navigate(`/warehouses/${rental.warehouseId}`)}
              >
                View Warehouse
              </Button>
              {rental.status === 'active' && (
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  onClick={() => setCancelDialogOpen(true)}
                >
                  Cancel Rental
                </Button>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>Cancel Rental</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this rental? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>No, Keep It</Button>
          <Button
            onClick={handleCancel}
            color="error"
            variant="contained"
            disabled={cancelling}
          >
            {cancelling ? 'Cancelling...' : 'Yes, Cancel Rental'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RentalDetails; 