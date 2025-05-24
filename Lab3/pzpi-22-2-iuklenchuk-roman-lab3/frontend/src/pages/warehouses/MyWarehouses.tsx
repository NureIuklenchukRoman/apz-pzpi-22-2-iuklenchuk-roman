import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  TextField,
  Grid,
  Paper,
  Slider,
  FormControlLabel,
  Switch,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StraightenIcon from '@mui/icons-material/Straighten';
import FilterListIcon from '@mui/icons-material/FilterList';
import api from '../../services/api';

interface Warehouse {
  id: number;
  name: string;
  location: string;
  size_sqm: number;
  price_per_day: number;
  is_blocked: boolean;
}

interface Filters {
  name: string;
  location: string;
  minPrice: number;
  maxPrice: number;
  minSize: number;
  maxSize: number;
  showBlocked: boolean;
}

const MyWarehouses = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [filteredWarehouses, setFilteredWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    name: '',
    location: '',
    minPrice: 0,
    maxPrice: 1000,
    minSize: 0,
    maxSize: 1000,
    showBlocked: true,
  });
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth?.user);

  useEffect(() => {
    fetchMyWarehouses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [warehouses, filters]);

  const fetchMyWarehouses = async () => {
    try {
      const response = await api.get('/warehouses/my-warehouses');
      setWarehouses(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch warehouses');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...warehouses];

    if (filters.name) {
      filtered = filtered.filter(w => 
        w.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.location) {
      filtered = filtered.filter(w => 
        w.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    filtered = filtered.filter(w => 
      w.price_per_day >= filters.minPrice && 
      w.price_per_day <= filters.maxPrice
    );

    filtered = filtered.filter(w => 
      w.size_sqm >= filters.minSize && 
      w.size_sqm <= filters.maxSize
    );

    if (!filters.showBlocked) {
      filtered = filtered.filter(w => !w.is_blocked);
    }

    setFilteredWarehouses(filtered);
  };

  const handleFilterChange = (field: keyof Filters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleViewDetails = (id: number) => {
    navigate(`/warehouses/${id}`);
  };

  const handleCreateWarehouse = () => {
    navigate('/warehouses/create');
  };

  if (!user || user.role !== 'seller') {
    return (
      <Container maxWidth="sm">
        <Alert severity="error" sx={{ mt: 4 }}>
          Access denied. Only sellers can view their warehouses.
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          My Warehouses
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{ mr: 2 }}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Button variant="contained" color="primary" onClick={handleCreateWarehouse}>
            Create Warehouse
          </Button>
        </Box>
      </Box>

      {showFilters && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Name"
                value={filters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Location"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography gutterBottom>Price Range</Typography>
              <Slider
                value={[filters.minPrice, filters.maxPrice]}
                onChange={(_, value) => {
                  const [min, max] = value as number[];
                  handleFilterChange('minPrice', min);
                  handleFilterChange('maxPrice', max);
                }}
                valueLabelDisplay="auto"
                min={0}
                max={1000}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography gutterBottom>Size Range (m²)</Typography>
              <Slider
                value={[filters.minSize, filters.maxSize]}
                onChange={(_, value) => {
                  const [min, max] = value as number[];
                  handleFilterChange('minSize', min);
                  handleFilterChange('maxSize', max);
                }}
                valueLabelDisplay="auto"
                min={0}
                max={1000}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={filters.showBlocked}
                    onChange={(e) => handleFilterChange('showBlocked', e.target.checked)}
                  />
                }
                label="Show Blocked Warehouses"
              />
            </Grid>
          </Grid>
        </Paper>
      )}

      {error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          {filteredWarehouses.map((warehouse) => (
            <Box key={warehouse.id} sx={{ width: { xs: '100%', sm: '48%', md: '31%', lg: '23%' }, mb: 3 }}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-6px) scale(1.03)',
                    boxShadow: 6,
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  border: warehouse.is_blocked ? '2px solid #ff6b6b' : 'none',
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {warehouse.name}
                    {warehouse.is_blocked && (
                      <Typography
                        component="span"
                        sx={{
                          ml: 1,
                          color: '#ff6b6b',
                          fontSize: '0.8rem',
                          fontWeight: 'normal',
                        }}
                      >
                        (Blocked)
                      </Typography>
                    )}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <LocationOnIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {warehouse.location}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <StraightenIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Size: {warehouse.size_sqm} m²
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="primary" fontWeight={700} mb={1}>
                    ${warehouse.price_per_day.toFixed(2)}/day
                  </Typography>
                </CardContent>
                <Box flexGrow={1} />
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      onClick={() => handleViewDetails(warehouse.id)}
                      sx={{ fontWeight: 600 }}
                      disabled={warehouse.is_blocked}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => navigate(`/warehouses/${warehouse.id}/edit`)}
                      sx={{ fontWeight: 600 }}
                      disabled={warehouse.is_blocked}
                    >
                      Edit
                    </Button>
                  </Box>
                </CardActions>
              </Card>
            </Box>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MyWarehouses; 