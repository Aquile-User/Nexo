import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import nexoLogo from '../assets/nexo-logo.png';
import '../styles/sidebar.css';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Evaluaciones', icon: <AssessmentIcon />, path: '/evaluaciones' },
  { text: 'Usuarios', icon: <PeopleIcon />, path: '/usuarios' },
  { text: 'Configuración', icon: <SettingsIcon />, path: '/configuracion' },
];

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const [expanded, setExpanded] = useState(true);

  const toggleExpand = () => {
    const newExpandedState = !expanded;
    setExpanded(newExpandedState);
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  return (
    <Drawer
      variant="permanent"
      className={`sidebar ${expanded ? 'expanded' : 'collapsed'}`}
      classes={{
        paper: `sidebar ${expanded ? 'expanded' : 'collapsed'}`,
      }}
    >
      <Box className="sidebar-header">
        <Box className="logo-container">
          <img src={nexoLogo} alt="Nexo Logo" className="logo" />
          {expanded && <Typography variant="h6">Nexo</Typography>}
        </Box>
      </Box>

      <Divider />

      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <Tooltip title={expanded ? '' : item.text} placement="right">
              <ListItemIcon className="menu-icon">{item.icon}</ListItemIcon>
            </Tooltip>
            {expanded && <ListItemText primary={item.text} />}
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default Sidebar;