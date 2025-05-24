import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../store';
import type { User } from '../types/user';
import { logout } from '../store/slices/authSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useAppSelector((state) => state.auth?.user) as User | null;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Warehouse Manager
        </Typography>
        <Box>
          {user ? (
            <>
              <Button color="inherit" onClick={() => navigate('/warehouses')}>Warehouses</Button>
              {user.role === 'seller' && (
                <>
                  <Button color="inherit" onClick={() => navigate('/my-warehouses')}>My Warehouses</Button>
                  <Button color="inherit" onClick={() => navigate('/revenue')}>Revenue</Button>
                </>
              )}
              {user.role === 'admin' && (
                <Button color="inherit" onClick={() => navigate('/admin')}>Admin Panel</Button>
              )}
              <Button color="inherit" onClick={() => navigate('/rentals')}>Rentals</Button>
              <Button color="inherit" onClick={() => navigate('/messages')}>Messages</Button>
              <Button color="inherit" onClick={() => navigate('/profile')}>Profile</Button>
              <Typography component="span" sx={{ mr: 2 }}>
                {user.username}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={() => navigate('/login')}>
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 