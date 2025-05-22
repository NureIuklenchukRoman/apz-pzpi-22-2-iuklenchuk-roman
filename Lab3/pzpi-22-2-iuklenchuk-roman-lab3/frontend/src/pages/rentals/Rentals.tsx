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
      const response = await api.get('/users/my_rents/');
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Rentals
      </Typography>

      <Grid container spacing={3}>
        {rentals.map((rental) => (
          <Grid item xs={12} md={6} key={rental.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  {rental.warehouseName}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={rental.status.toUpperCase()}
                    color={getStatusColor(rental.status)}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Start Date: {new Date(rental.startDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  End Date: {new Date(rental.endDate).toLocaleDateString()}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                  Total: ${rental.totalAmount}
                </Typography>
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
      </Grid>
    </Container>
  );
};

export default Rentals; 