import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  Divider,
  Avatar,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../services/api';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
}

const Profile = () => {
  const dispatch = useDispatch();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/me/');
      const data = response.data;
      const mappedData = {
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        email: data.email || '',
        phone: data.phone || '',
        avatar: data.avatar || '',
      };
      setProfile(mappedData);
      setFormData(mappedData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Map frontend fields to backend fields
      const payload: any = {
        ...formData,
        first_name: formData.firstName,
        last_name: formData.lastName,
      };
      delete payload.firstName;
      delete payload.lastName;

      await api.put('/users/me/', payload);
      setSuccess('Profile updated successfully');
      fetchProfile(); // Refresh profile data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
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
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Profile
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

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            src={profile?.avatar}
            sx={{ width: 100, height: 100, mr: 3 }}
          >
            {profile?.firstName?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h5">
              {profile?.firstName} {profile?.lastName}
            </Typography>
            <Typography color="text.secondary">
              {profile?.email}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleSubmit}>
          <Box display="flex" flexWrap="wrap" gap={3}>
            <Box flex={1} minWidth={220}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={saving}
              />
            </Box>
            <Box flex={1} minWidth={220}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={saving}
              />
            </Box>
            <Box width="100%">
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={saving}
              />
            </Box>
            <Box width="100%">
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={saving}
              />
            </Box>
            <Box width="100%">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={saving}
                sx={{ mt: 2 }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Profile; 