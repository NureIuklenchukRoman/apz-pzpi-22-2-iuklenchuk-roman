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
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Storage as StorageIcon,
  AttachMoney as MoneyIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import api from '../../services/api';

interface Warehouse {
  id: string;
  name: string;
  location: string;
  description: string;
  capacity: number;
  availableSpace: number;
  price: number;
  features: string[];
  contactPhone: string;
  contactEmail: string;
  status: 'available' | 'rented' | 'maintenance';
}

const WarehouseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWarehouseDetails();
  }, [id]);

  const fetchWarehouseDetails = async () => {
    try {
      const response = await api.get(`/warehouses/${id}`);
      setWarehouse(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch warehouse details');
    } finally {
      setLoading(false);
    }
  };

  const handleRent = () => {
    navigate(`/rentals/new?warehouseId=${id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'rented':
        return 'error';
      case 'maintenance':
        return 'warning';
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

  if (!warehouse) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">Warehouse not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            {warehouse.name}
          </Typography>
          <Chip
            label={warehouse.status.charAt(0).toUpperCase() + warehouse.status.slice(1)}
            color={getStatusColor(warehouse.status)}
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography paragraph>{warehouse.description}</Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Features
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {warehouse.features.map((feature, index) => (
                <Chip key={index} label={feature} />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Details
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationIcon sx={{ mr: 1 }} />
                <Typography>{warehouse.location}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StorageIcon sx={{ mr: 1 }} />
                <Typography>
                  {warehouse.availableSpace} / {warehouse.capacity} m² available
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MoneyIcon sx={{ mr: 1 }} />
                <Typography>${warehouse.price}/month</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                Contact Information
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PhoneIcon sx={{ mr: 1, fontSize: 'small' }} />
                <Typography variant="body2">{warehouse.contactPhone}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon sx={{ mr: 1, fontSize: 'small' }} />
                <Typography variant="body2">{warehouse.contactEmail}</Typography>
              </Box>
            </Paper>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ mt: 3 }}
              onClick={handleRent}
              disabled={warehouse.status !== 'available'}
            >
              {warehouse.status === 'available' ? 'Rent Now' : 'Not Available'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default WarehouseDetails; 