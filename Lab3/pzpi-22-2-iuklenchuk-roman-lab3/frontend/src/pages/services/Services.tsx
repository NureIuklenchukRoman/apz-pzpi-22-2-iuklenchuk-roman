import { useState, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import api from '../../services/api';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  category: string;
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [requestNote, setRequestNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      setServices(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestService = (service: Service) => {
    setSelectedService(service);
    setRequestDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setRequestDialogOpen(false);
    setSelectedService(null);
    setRequestNote('');
  };

  const handleSubmitRequest = async () => {
    if (!selectedService) return;

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/service-requests', {
        serviceId: selectedService.id,
        note: requestNote,
      });
      setSuccess('Service request submitted successfully');
      handleCloseDialog();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit service request');
    } finally {
      setSubmitting(false);
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
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Available Services
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {services.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  {service.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {service.category}
                </Typography>
                <Typography variant="body2" paragraph>
                  {service.description}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Duration: {service.duration}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                  ${service.price}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleRequestService(service)}
                >
                  Request Service
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={requestDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>
          Request Service: {selectedService?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body1" gutterBottom>
              Please provide any additional notes or requirements for this service:
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={requestNote}
              onChange={(e) => setRequestNote(e.target.value)}
              placeholder="Enter your notes here..."
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmitRequest}
            variant="contained"
            color="primary"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Request'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Services; 