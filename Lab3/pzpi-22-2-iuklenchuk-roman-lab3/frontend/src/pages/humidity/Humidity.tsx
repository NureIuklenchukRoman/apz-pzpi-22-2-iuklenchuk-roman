import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
  Button,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import {
  WaterDrop as WaterDropIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import api from '../../services/api';

interface HumidityData {
  id: string;
  warehouseId: string;
  warehouseName: string;
  currentHumidity: number;
  targetHumidity: number;
  lastUpdated: string;
  status: 'normal' | 'warning' | 'critical';
}

const Humidity = () => {
  const [humidityData, setHumidityData] = useState<HumidityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchHumidityData();
    // Set up polling for real-time updates
    const interval = setInterval(fetchHumidityData, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchHumidityData = async () => {
    try {
      const response = await api.get('/humidity');
      setHumidityData(response.data);
      if (response.data.length > 0 && !selectedWarehouse) {
        setSelectedWarehouse(response.data[0].id);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch humidity data');
    } finally {
      setLoading(false);
    }
  };

  const handleWarehouseChange = (event: SelectChangeEvent) => {
    setSelectedWarehouse(event.target.value);
  };

  const handleTargetHumidityChange = async (value: number) => {
    if (!selectedWarehouse) return;

    setUpdating(true);
    setError('');

    try {
      await api.put(`/humidity/${selectedWarehouse}`, {
        targetHumidity: value,
      });
      fetchHumidityData(); // Refresh data after update
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update target humidity');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'success.main';
      case 'warning':
        return 'warning.main';
      case 'critical':
        return 'error.main';
      default:
        return 'text.secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <CheckCircleIcon color="success" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'critical':
        return <WarningIcon color="error" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ width: '100%' }}>
        Humidity Monitoring
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ width: '100%' }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Warehouse Selection
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Warehouse</InputLabel>
              <Select
                value={selectedWarehouse}
                label="Select Warehouse"
                onChange={handleWarehouseChange}
              >
                {humidityData.map((data) => (
                  <MenuItem key={data.id} value={data.id}>
                    {data.warehouseName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedWarehouse && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Target Humidity
                </Typography>
                <Slider
                  value={humidityData.find(d => d.id === selectedWarehouse)?.targetHumidity || 50}
                  onChange={(_, value) => handleTargetHumidityChange(value as number)}
                  min={30}
                  max={70}
                  step={1}
                  marks={[
                    { value: 30, label: '30%' },
                    { value: 50, label: '50%' },
                    { value: 70, label: '70%' },
                  ]}
                  disabled={updating}
                />
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {humidityData.map((data) => (
              <Grid item xs={12} sm={6} key={data.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <WaterDropIcon sx={{ mr: 1 }} />
                      <Typography variant="h6" component="div">
                        {data.warehouseName}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                        Current Humidity:
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: getStatusColor(data.status) }}
                      >
                        {data.currentHumidity}%
                      </Typography>
                      {getStatusIcon(data.status)}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Target: {data.targetHumidity}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                      Last updated: {new Date(data.lastUpdated).toLocaleString()}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => setSelectedWarehouse(data.id)}
                    >
                      Adjust Settings
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Humidity; 