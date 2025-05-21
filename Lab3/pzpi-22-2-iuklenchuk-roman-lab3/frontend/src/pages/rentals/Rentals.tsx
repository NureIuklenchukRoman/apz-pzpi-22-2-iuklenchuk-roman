import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import api from '../../services/api';

interface Rental {
  id: string;
  warehouseId: string;
  warehouseName: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  totalAmount: number;
}

const Rentals = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      const response = await api.get('/rentals');
      setRentals(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch rentals');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (id: string) => {
    navigate(`/rentals/${id}`);
  };

  const getStatusColor = (status: Rental['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'completed':
        return 'info';
      case 'cancelled':
        return 'error';
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

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          My Rentals
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/warehouses')}
        >
          Rent New Warehouse
        </Button>
      </Box>

      <Grid container spacing={3}>
        {rentals.map((rental) => (
          <Grid item xs={12} key={rental.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="h6" component="h2">
                      {rental.warehouseName}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      Rental Period: {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                      ${rental.totalAmount}
                    </Typography>
                  </Box>
                  <Chip
                    label={rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                    color={getStatusColor(rental.status)}
                    sx={{ ml: 2 }}
                  />
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleViewDetails(rental.id)}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
        {rentals.length === 0 && (
          <Grid item xs={12}>
            <Alert severity="info">
              You don't have any rentals yet. Click the "Rent New Warehouse" button to get started.
            </Alert>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Rentals; 