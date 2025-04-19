import React, { useState, useEffect } from 'react';
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
  const [anchorEl, setAnchorEl] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const userData = authService.getCurrentUser();
    console.log('Datos del usuario en TopBar:', userData);

    if (userData && userData.user) {
      const user = userData.user;
      console.log('Datos del usuario anidados:', user);

      // El nombre completo está en la propiedad 'nombre'
      if (user.nombre) {
        setUserName(user.nombre);
      } else {
        // Si no hay nombre, mostramos el email
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

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  return (
    <AppBar position="fixed" className="topbar">
      <Toolbar>
        <Box className="topbar-content">
          <Box className="topbar-right">
            <Typography variant="subtitle1" style={{ color: 'var(--white)', marginRight: '16px' }}>
              {userName}
            </Typography>
            <IconButton
              size="large"
              aria-label="account of current user"
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
              <MenuItem onClick={handleClose}>Perfil</MenuItem>
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