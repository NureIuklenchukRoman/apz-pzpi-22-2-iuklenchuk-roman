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
} from '@mui/material';
import api from '../../services/api';

interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  availableSpace: number;
  price: number;
}

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const response = await api.get('/warehouses');
      setWarehouses(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch warehouses');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (id: string) => {
    navigate(`/warehouses/${id}`);
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
      <Typography variant="h4" component="h1" gutterBottom>
        Available Warehouses
      </Typography>
      <Grid container spacing={3}>
        {warehouses.map((warehouse) => (
          <Grid item xs={12} sm={6} md={4} key={warehouse.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2">
                  {warehouse.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {warehouse.location}
                </Typography>
                <Typography variant="body2">
                  Capacity: {warehouse.capacity} m²
                </Typography>
                <Typography variant="body2">
                  Available Space: {warehouse.availableSpace} m²
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                  ${warehouse.price}/month
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleViewDetails(warehouse.id)}
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

export default Warehouses; 