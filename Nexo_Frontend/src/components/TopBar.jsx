import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Box,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import '../styles/topbar.css';
import authService from '../services/authService';

function TopBar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const userData = authService.getCurrentUser();
    if (userData && userData.user) {
      const user = userData.user;
      if (user.nombre) {
        setUserName(user.nombre);
      } else {
        setUserName(user.email || 'Usuario');
      }
    }
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    navigate('/perfil');
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <AppBar position="fixed" className="topbar">
      <Toolbar>
        <Box className="topbar-content">
          <Box className="topbar-right">
            <Typography variant="subtitle1" sx={{ color: 'white', marginRight: '16px' }}>
              {userName}
            </Typography>
            <IconButton
              size="large"
              aria-label="cuenta del usuario"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar>
                <AccountCircle />
              </Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleProfile}>Perfil</MenuItem>
              <MenuItem onClick={handleClose}>Configuración</MenuItem>
              <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;