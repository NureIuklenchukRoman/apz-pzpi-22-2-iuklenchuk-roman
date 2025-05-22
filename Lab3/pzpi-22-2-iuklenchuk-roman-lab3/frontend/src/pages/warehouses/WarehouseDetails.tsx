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
      const response = await api.get(`/warehouses/${id}/`);
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
      <Typography variant="h4" component="h1" gutterBottom>
        {warehouse.name}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography paragraph>
              {warehouse.description}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Features
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {warehouse.features.map((feature, index) => (
                <Chip key={index} label={feature} />
              ))}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon color="action" />
                <Typography>{warehouse.contactPhone}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon color="action" />
                <Typography>{warehouse.contactEmail}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Chip
                label={warehouse.status.toUpperCase()}
                color={getStatusColor(warehouse.status)}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <LocationIcon color="action" />
                <Typography>{warehouse.location}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <StorageIcon color="action" />
                <Typography>
                  Available Space: {warehouse.availableSpace} sqm
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MoneyIcon color="action" />
                <Typography>
                  Total Capacity: {warehouse.capacity} sqm
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleRent}
              disabled={warehouse.status !== 'available'}
            >
              {warehouse.status === 'available' ? 'Rent Now' : 'Not Available'}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default WarehouseDetails; 